import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params (Next.js 16 requirement)
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { error: "Invalid Job ID" },
        { status: 400 }
      );
    }

    // 🔐 Auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: number;
      role: string;
    };

    // 🎯 Candidate-only
    if (decoded.role !== "CANDIDATE") {
      return NextResponse.json(
        { error: "Only candidates can apply" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { resume, coverNote } = body;

    if (!resume) {
      return NextResponse.json(
        { error: "Resume is required" },
        { status: 400 }
      );
    }

    // 🧠 Prevent duplicate application
    const existing = await prisma.application.findFirst({
      where: {
        jobId,
        userId: decoded.userId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    // ✅ Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        userId: decoded.userId,
        resume,
        coverNote,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Apply job error:", error);
    return NextResponse.json(
      { error: "Failed to apply to job" },
      { status: 500 }
    );
  }
}
