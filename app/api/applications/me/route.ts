import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { error } from "console";

export async function GET(request:Request){
    try{
        //1 Auth header check
        const authHeader= request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            );
        }
        const token= authHeader.split(" ")[1];

        //2 Verify JWT
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {
            userId: number;
            role: string;
        };
        // 3 Role Check- Candidates Only
        if (decoded.role !== "CANDIDATE"){
            return NextResponse.json(
                {error: "Forbidden - Candidates Only"},
                {status:403}
            );
        }
        // 4 Fetch applications for logged-in candidate
        const applications = await prisma.application.findMany({
            where:{
                userId:decoded.userId,
            },
            include:{
                job:{
                    select:{
                        id:true,
                        title:true,
                        company:true,
                        location:true,
                        jobType:true,
                        createdAt:true,
                    },
                },
            },
            orderBy:{
                appliedAt:"desc",
            },
        });
        return NextResponse.json(applications,{status:200});
        
    } catch (error){
        console.error(error);
        return NextResponse.json(
            {error:"Failed to fetch applications"},
            {status:500}
        );
    }
}