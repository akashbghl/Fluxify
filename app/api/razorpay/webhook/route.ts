import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { sendMail } from "@/lib/mail";
import { getSubscriptionActivatedEmailTemplate } from "@/lib/emailTemplates";

export const runtime = "nodejs"; // Important for server-side API

export async function GET() {
  console.log("GET webhook hit");
  return new Response("ok");
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

    // Razorpay sends raw JSON string
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;

    // Signature verification
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("Invalid signature!");
      return NextResponse.json({ status: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      const subscription = await Subscription.findOne({ razorpayOrderId: orderId });
      if (!subscription) return NextResponse.json({ status: "Subscription not found" });

      if (subscription.status === "ACTIVE")
        return NextResponse.json({ status: "Already active" });

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

      const [organization, manager] = await Promise.all([
        Organization.findById(subscription.organization).select("name"),
        User.findOne({
          organizationId: subscription.organization,
          role: "MANAGER",
        }).select("name email"),
      ]);

      if (manager?.email) {
        const template = getSubscriptionActivatedEmailTemplate({
          recipientName: manager.name || "Manager",
          organizationName: organization?.name || "Your Organization",
          plan: subscription.plan,
          startDate,
          endDate,
          amount: subscription.amount,
          currency: subscription.currency,
          paymentId: paymentId,
        });

        await sendMail({
          to: manager.email,
          subject: template.subject,
          html: template.html,
        });
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      await Subscription.findOneAndUpdate({ razorpayOrderId: orderId }, { status: "FAILED" });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ status: "Server error" }, { status: 500 });
  }
}
