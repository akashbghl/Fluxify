import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import Organization from "@/models/Organization";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { success: false, message: "Missing payment fields" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_LIVE_SECRET as string;

    /* ==========================
       Signature Verification
    ========================== */
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    /* ==========================
       Find Subscription
    ========================== */
    const subscription = await Subscription.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "Subscription not found" },
        { status: 404 }
      );
    }

    // Prevent double verification
    if (subscription.status === "ACTIVE") {
      return NextResponse.json({
        success: true,
        message: "Already verified",
      });
    }

    /* ==========================
       Activate Subscription
    ========================== */
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month plan

    subscription.status = "ACTIVE";
    subscription.razorpayPaymentId = razorpay_payment_id;
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    subscription.paidAt = new Date();

    await subscription.save();

    /* ==========================
       Update Organization Plan
    ========================== */
    await Organization.findByIdAndUpdate(
      subscription.organization,
      {
        plan: subscription.plan,
        subscriptionStatus: "ACTIVE",
        subscriptionEndDate: endDate,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription activated successfully",
    });

  } catch (error: any) {
    console.error("Verify Payment Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}