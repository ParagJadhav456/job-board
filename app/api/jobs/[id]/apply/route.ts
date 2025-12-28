import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(
  request: Request,
  { params }: { params: { id: string } } // ✅ params is now a Promise
) {
  try {
    // ✅ Await params before using
    const { id } = await params;
    
    console.log("📍 Received application request for job:", id);

    // 1️⃣ Authorization header check
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Missing or invalid authorization header");
      return NextResponse.json(
        { error: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
        role: string;
      };
      console.log("✅ Token verified for user:", decoded.userId);
    } catch (jwtError) {
      console.log("❌ JWT verification failed:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 3️⃣ Role check
    if (decoded.role !== "CANDIDATE") {
      console.log("❌ User is not a candidate:", decoded.role);
      return NextResponse.json(
        { error: "Forbidden - Candidates only" },
        { status: 403 }
      );
    }

    // 4️⃣ Validate jobId
    const jobId = parseInt(id, 10);
    if (Number.isNaN(jobId)) {
      console.log("❌ Invalid job ID:", id);
      return NextResponse.json(
        { error: "Invalid Job ID" },
        { status: 400 }
      );
    }

    // 5️⃣ Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      console.log("❌ Job not found:", jobId);
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // 6️⃣ Read request body
    const body = await request.json();
    const { resume, coverNote } = body;

    console.log("📄 Application data:", { resume, coverNote });

    if (!resume) {
      console.log("❌ Resume is missing");
      return NextResponse.json(
        { error: "Resume is required" },
        { status: 400 }
      );
    }

    // 7️⃣ Create application
    const application = await prisma.application.create({
      data: {
        resume,
        coverNote,
        userId: decoded.userId,
        jobId,
      },
    });

    console.log("✅ Application created:", application.id);
    return NextResponse.json(application, { status: 201 });

  } catch (error: any) {
    // Duplicate application
    if (error.code === "P2002") {
      console.log("❌ Duplicate application attempt");
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    console.error("❌ Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to apply to job", details: error.message },
      { status: 500 }
    );
  }
}