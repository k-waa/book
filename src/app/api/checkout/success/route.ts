import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe"

// 購入履歴の保存
export async function POST(request: Request) {
    if(process.env.STRIPE_SECRET_KEY) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const { sessionId } = await request.json();
    
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if(session.metadata && session.client_reference_id) {
                const existingPurchase = prisma.purchase.findFirst({
                    where: {
                        userId: session.client_reference_id,
                        bookId: session.metadata.bookId
                    }
                })

                // バグ要修正
                // if(!existingPurchase) {
                const purchase = await prisma.purchase.create({
                    data: {
                        userId: session.client_reference_id,
                        bookId: session.metadata.bookId,
                    }
                });

                return NextResponse.json({ purchase, existingPurchase });
                // } else {
                //     return NextResponse.json({message: "すでに購入済みです"})
                // }
            } else {
                return NextResponse.json({ message: 'invalid params' })
            }
            
        } catch (err) {
            if(err instanceof Error) {
                return NextResponse.json({ message: err.message })
            }
            
            return NextResponse.json({ message: 'an unknown error' })
        }
    } else {
        return NextResponse.json({ message: 'apiKey not found.' })
    }
}