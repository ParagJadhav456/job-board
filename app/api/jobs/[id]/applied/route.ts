import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ applied: false }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const jobId = Number(params.id);

    const existing = await prisma.application.findFirst({
      where: {
        jobId,
        userId: decoded.userId,
      },
    });

    return NextResponse.json({
      applied: !!existing,
    });
  } catch (error) {
    return NextResponse.json({ applied: false }, { status: 500 });
  }
}
