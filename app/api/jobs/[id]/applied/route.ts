import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = req.headers.get("authorization");

    // No token → user not logged in → NOT applied
    if (!auth) {
      return NextResponse.json({ applied: false });
    }

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: number };

    const jobId = Number(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json({ applied: false });
    }

    const application = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        userId: decoded.userId,
      },
    });

    return NextResponse.json({
      applied: Boolean(application),
    });
  } catch (err) {
    // Any error → assume NOT applied (safe UX)
    return NextResponse.json({ applied: false });
  }
}
