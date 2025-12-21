import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function POST(request: Request){

    try{
        const body= await request.json();
        const {email, password} =body;
        // 1 Basic validation
        if (!email || !password){
        return NextResponse.json(
            { error: "Email and Password are required"},
            { status: 400}
        );
    }
        // 2 Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user){
            return NextResponse.json(
                {error:"Invalid credentials"},
                { status: 401}
            );
        }

        // 3 compare password
        const isPassworValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPassworValid){
            return NextResponse.json(
                {error:"Invalid credentials"},
                { status: 401}
            );
        }
        // 4 Generate JWT
        const token = jwt.sign(
            {
                userId:user.id,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d"}
        );

        // 5 Return response (never return password)
        return NextResponse.json(
            {
                token,
                user:{
                    id:user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },

            },
            {status:200}
        );

    } catch (error){
        console.error("LOGIN ERROR:",error);
        return NextResponse.json(
            { error: "Login failed"},
            { status: 500}
        );
    }


}