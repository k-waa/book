import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request, 
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params

    try {
        const purchases = await prisma.purchase.findMany({
            where: { userId: userId },
        })

        return NextResponse.json(purchases)
    } catch (err) {
        if(err instanceof Error) {
            return NextResponse.json({ message: err.message })
        }
        
        return NextResponse.json({ message: 'an unknown error' })
    }
}