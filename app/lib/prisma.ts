// Imports PrismaClient, which is the main class used to:
    // Connect to your database
    // Run queries like prisma.user.findMany()
    // The path @/app/generated/prisma suggests:
    // You’re using a custom Prisma client output path Usually generated via prisma generate
import  { PrismaClient } from "@prisma/client";




// 2️⃣ Create a typed reference on globalThis
    // What’s happening here?
        // globalThis is the global object in Node.js
        // Similar to window in browsers
const globalForPrisma = globalThis as unknown as {
        // We extend it with a custom property:
    prisma: PrismaClient | undefined;
        //Why the as unknown as?
        // TypeScript doesn’t know that globalThis has a prisma property
        // So we: Cast it to unknown,Then cast it to our custom type
        // ✅ This avoids TypeScript errors while keeping type safety.
};


// 3️⃣ Create or reuse PrismaClient (core logic)
        // What it does:
            // If a Prisma instance already exists on globalThis
            // → reuse it
            // Otherwise
            // → create a new PrismaClient
            // ✅ This ensures only ONE PrismaClient instance exists.

export const prisma=
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["query"], // 4️⃣ Enable query logging
    });


// On dev files reload frequently and then it Run once on Production
if (process.env.NODE_ENV !== "production"){
    globalForPrisma.prisma = prisma;
}



// Mental Map

        // App starts
        //    ↓
        // Check if globalThis.prisma exists
        //    ↓
        // YES → reuse it
        // NO  → create new PrismaClient
        //    ↓
        // In dev → store it globally