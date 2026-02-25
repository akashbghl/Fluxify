import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { requireAuth } from "@/lib/requireAuth";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const auth = await requireAuth();
        const { organizationId } = auth;

        if (
            !process.env.RAZORPAY_TEST_KEY ||
            !process.env.RAZORPAY_TEST_SECRET
        ) {
            return NextResponse.json(
                { success: false, message: "Razorpay keys missing" },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_TEST_KEY,
            key_secret: process.env.RAZORPAY_TEST_SECRET,
        });

        const plan = "PRO";
        const monthlyPrice = 999;
        const amountInPaise = monthlyPrice * 100;

        /* =========================
           Create Razorpay Order
        ========================== */
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `sub_${Date.now()}`,
            notes: {
                organizationId,
                plan,
            },
        });

        /* =========================
           Store Pending Subscription
        ========================== */
        await Subscription.findOneAndUpdate(
            {
                organization: organizationId,
            },
            {
                status: "PENDING",
                $set: {
                    plan,
                    razorpayOrderId: order.id,
                    amount: monthlyPrice,
                    currency: "INR",
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error: any) {
        console.error("Initiate Payment Error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to initiate payment" },
            { status: 500 }
        );
    }
}