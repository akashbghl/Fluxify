import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { sendMail } from "@/lib/mail";
import { getStudentSelfRegistrationRequestTemplate } from "@/lib/emailTemplates";

const requestSchema = z.object({
  organizationSlug: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(8),
  plan: z.enum(["1_MONTH", "3_MONTH", "6_MONTH", "12_MONTH"]),
  preferredShift: z.string().min(1),
  notes: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const {
      organizationSlug,
      name,
      email,
      phone,
      plan,
      preferredShift,
      notes,
    } = parsed.data;

    const organization = await Organization.findOne({
      slug: organizationSlug,
      isActive: true,
    }).select("_id name slug");

    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 }
      );
    }

    const manager = await User.findOne({
      organizationId: organization._id,
      role: "MANAGER",
      isActive: true,
    }).select("name email");

    if (!manager?.email) {
      return NextResponse.json(
        { success: false, message: "Manager email not configured" },
        { status: 400 }
      );
    }

    const prefill = new URLSearchParams({
      name,
      phone,
      plan,
      shiftNames: preferredShift,
    });
    if (email) prefill.set("email", email);

    const reviewUrl = `${req.nextUrl.origin}/dashboard/students/add?${prefill.toString()}`;

    const template = getStudentSelfRegistrationRequestTemplate({
      managerName: manager.name || "Manager",
      organizationName: organization.name,
      studentName: name,
      studentEmail: email || undefined,
      studentPhone: phone,
      requestedPlan: plan,
      requestedShift: preferredShift,
      notes: notes || undefined,
      reviewUrl,
    });

    const sent = await sendMail({
      to: manager.email,
      subject: template.subject,
      html: template.html,
    });

    if (!sent) {
      return NextResponse.json(
        { success: false, message: "Failed to send request to manager" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Request submitted successfully",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to submit request";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

