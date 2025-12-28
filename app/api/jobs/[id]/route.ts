import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Promise
) {
  const { id } = await params; // ✅ await params

  console.log("JOB ID PARAM:", id); // (debug – optional)

  const jobId = Number(id);

  if (isNaN(jobId)) {
    return NextResponse.json(
      { error: "Invalid job id" },
      { status: 400 }
    );
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      recruiter: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!job) {
    return NextResponse.json(
      { error: "Job not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(job);
}
