import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params (Next.js 16 requirement)
    const { id } = await context.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return NextResponse.json(
        { applied: false },
        { status: 400 }
      );
    }

    // 🔐 Auth
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { applied: false },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: number };

    // 🔍 Check application
    const existing = await prisma.application.findFirst({
      where: {
        jobId,
        userId: decoded.userId,
      },
    });

    return NextResponse.json({
      applied: Boolean(existing),
    });
  } catch (error) {
    console.error("Applied check error:", error);
    return NextResponse.json(
      { applied: false },
      { status: 500 }
    );
  }
}
