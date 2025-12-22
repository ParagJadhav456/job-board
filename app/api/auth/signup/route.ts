import { NextResponse }  from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { error } from "console";


export async function POST(request:Request) {
    try {
        const body = await request.json();
        const {name, email,password} =body;
        // 1 validation
        if (!name || !email || !password){
            return NextResponse.json(
                {error: "Name, email and password are required"},
                {status:400}
            );
        }

        //2 Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where : {email},
        });
        if (existingUser){
            return NextResponse.json(
                {error: "User already exists with this email"},
                {status: 409}
            );
        }
        //3 Hash Password
        const hashedPassword = await bcrypt.hash(password,10);

        // 4 Create user (ONLY CANDIDATE)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "CANDIDATE",
            },
        });

        // 5 Return response (no JWT here)

        return NextResponse.json(
            {
                message:"Signup Sucessful",
                user:{
                    id: user.id,
                    name:user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            {status:201}
        );
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {error:"Signup failed"},
                {status:500}
            );

        }  
    
}