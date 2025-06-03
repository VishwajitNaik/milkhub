import Razorpay from "razorpay";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        const { amount } = await request.json();

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_ID,
        });

        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: "receipt#" + Math.floor(Math.random() * 10000),
        };

        // Create order with Razorpay
        const order = await razorpay.orders.create(options);

        return NextResponse.json({ message: "success", orderId: order.id, key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID });
    
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ message: "failed", error: error.message }, { status: 500 });
    }
}
