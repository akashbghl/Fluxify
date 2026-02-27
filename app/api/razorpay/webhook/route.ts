import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import Organization from "@/models/Organization";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

    const rawBody = await req.text(); // IMPORTANT: raw body
    const signature = req.headers.get("x-razorpay-signature") as string;

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ status: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    /* ==============================
       Handle Payment Captured
    ===============================*/
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      const subscription = await Subscription.findOne({
        razorpayOrderId: orderId,
      });

      if (!subscription) {
        return NextResponse.json({ status: "Subscription not found" });
      }

      // Prevent duplicate activation
      if (subscription.status === "ACTIVE") {
        return NextResponse.json({ status: "Already active" });
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      subscription.status = "ACTIVE";
      subscription.razorpayPaymentId = paymentId;
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      subscription.paidAt = new Date();

      await subscription.save();

      await Organization.findByIdAndUpdate(subscription.organization, {
        plan: subscription.plan,
        subscriptionStatus: "ACTIVE",
        subscriptionEndDate: endDate,
      });
    }

    /* ==============================
       Handle Payment Failed
    ===============================*/
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      await Subscription.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { status: "FAILED" }
      );
    }

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ status: "Server error" }, { status: 500 });
  }
}