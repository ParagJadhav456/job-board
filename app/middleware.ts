import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { error } from "console";
import { stringify } from "querystring";

export function middleware(request: NextResponse){
    const authHeader = request.headers.get("authorization");

    // 1 No Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return NextResponse.json(
            { error:"Unauthorized"},
            { status: 401}
        );
    }
    const token = authHeader.split(" ")[1];

    try {
        // 2 Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string  
        );
        // 3 Attach user info to request headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user",JSON.stringify(decoded));

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch(error){
        return NextResponse.json(
            {error: "Invalid or expired token"},
            { status: 401}
        );
    }

}

export const config={
    matcher:[
        "/api/jobs/:path*",
        "/api/applications/:path*"
    ],
};


// 👉 Meaning:
        // /api/jobs/* → protected
        // /api/applications/* → protected
        // /api/auth/login → public
        // /api/users → public (for now)