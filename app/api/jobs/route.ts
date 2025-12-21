import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function  GET() {
    try{
        const jobs = await prisma.job.findMany(
            {
                orderBy: {
                    createdAt:"desc",
                },
                include: {
                    recruiter:{
                        select:{
                            id: true,
                            name:true,
                            email:true,
                        },
                    },
                },

            });

        return NextResponse.json(jobs,{ status:200});
    } catch(error)
    {
        console.error(error);
        return NextResponse.json(
            {error:"Failed to fetch jobs"},
            {status: 500}
        );
    }
}


import jwt from "jsonwebtoken";
import { error } from "console";

export async function POST(request: Request){
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")){
            return NextResponse.json(
                { error: "Unauthorized"},
                { status:401}
            );
        }
        const token = authHeader.split(" ")[1];

        const decoded= jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            userId: number;
            role: string;
        };

        if (decoded.role !== "ADMIN") {
            return NextResponse.json(
                {error: "Forbideen - Admins only"},
                { status: 403}
            );
        }
        const body = await request.json();
        const { title, description, company, location, jobType}=body;
        
        if (!title ||  !description || !company || !location || !jobType){
            return NextResponse.json(
                {error: "Missing required fields"},
                {status:400}
            );
        } 
        const job = await prisma.job.create({
            data:{
                title,
                description,
                company,
                location,
                jobType,
                recruiterId: decoded.userId,
            }
        });
        return NextResponse.json(job, {status:201});
    } catch (error){
        console.error(error);
        return NextResponse.json(
            {error:"Failed to creatd job"},
            {status: 500}
        );
    }
}