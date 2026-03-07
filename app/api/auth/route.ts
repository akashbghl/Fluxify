import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Organization from "@/models/Organization";
import Subscription from "@/models/Subscription";
import EmailVerification from "@/models/EmailVerification";
import { generateToken } from "@/lib/auth";
import {
  validate,
  registerSchema,
  loginSchema,
} from "@/lib/validators";
import { sendMail } from "@/lib/mail";
import {
  getOrganizationUpdateEmailTemplate,
  getRegistrationOtpEmailTemplate,
  getSignupWelcomeEmailTemplate,
} from "@/lib/emailTemplates";

const OTP_EXPIRY_MINUTES = 10;

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST -> /api/auth
 * body: { type: "register" | "login" | "send_register_otp" | "verify_register_otp", ...payload }
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, message: "Type is required" },
        { status: 400 }
      );
    }

    if (type === "send_register_otp") {
      const email = String(body.email || "").trim().toLowerCase();
      const name = String(body.name || "").trim();

      if (!email) {
        return NextResponse.json(
          { success: false, message: "Email is required" },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({ email }).select("_id");
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 409 }
        );
      }

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      await EmailVerification.findOneAndUpdate(
        { email, purpose: "REGISTER" },
        {
          $set: {
            email,
            purpose: "REGISTER",
            otpHash: hashOtp(otp),
            expiresAt,
            verifiedAt: null,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const template = getRegistrationOtpEmailTemplate({
        name,
        otp,
        expiryMinutes: OTP_EXPIRY_MINUTES,
      });

      const mailSent = await sendMail({
        to: email,
        subject: template.subject,
        html: template.html,
      });

      if (!mailSent) {
        return NextResponse.json(
          { success: false, message: "Failed to send verification email" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Verification code sent to email",
      });
    }

    if (type === "verify_register_otp") {
      const email = String(body.email || "").trim().toLowerCase();
      const otp = String(body.otp || "").trim();

      if (!email || !otp) {
        return NextResponse.json(
          { success: false, message: "Email and OTP are required" },
          { status: 400 }
        );
      }

      const verification = await EmailVerification.findOne({
        email,
        purpose: "REGISTER",
      });

      if (!verification) {
        return NextResponse.json(
          { success: false, message: "No verification request found" },
          { status: 400 }
        );
      }

      if (verification.expiresAt.getTime() < Date.now()) {
        await EmailVerification.deleteOne({ _id: verification._id });
        return NextResponse.json(
          { success: false, message: "Verification code expired" },
          { status: 400 }
        );
      }

      if (verification.otpHash !== hashOtp(otp)) {
        return NextResponse.json(
          { success: false, message: "Invalid verification code" },
          { status: 400 }
        );
      }

      verification.verifiedAt = new Date();
      await verification.save();

      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
      });
    }

    if (type === "register") {
      const data = validate(registerSchema, body);
      const normalizedEmail = data.email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 409 }
        );
      }

      const verification = await EmailVerification.findOne({
        email: normalizedEmail,
        purpose: "REGISTER",
      });

      if (
        !verification ||
        !verification.verifiedAt ||
        verification.expiresAt.getTime() < Date.now()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Please verify your email before creating account",
          },
          { status: 403 }
        );
      }

      const slug =
        data.organizationName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Date.now();

      const organization = await Organization.create({
        name: data.organizationName,
        slug,
        email: normalizedEmail,
        plan: "FREE",
      });

      const user = await User.create({
        ...data,
        email: normalizedEmail,
        role: "MANAGER",
        organizationId: organization._id,
      });

      await EmailVerification.deleteOne({ _id: verification._id });

      const welcomeTemplate = getSignupWelcomeEmailTemplate({
        name: user.name,
        organizationName: organization.name,
        role: user.role,
      });

      const managerUpdateTemplate = getOrganizationUpdateEmailTemplate({
        recipientName: user.name,
        organizationName: organization.name,
        updateTitle: "Organization Created",
        updateMessage:
          "Your organization workspace is ready. Complete setup to start managing seats, students, and payments.",
      });

      await Promise.allSettled([
        sendMail({
          to: normalizedEmail,
          subject: welcomeTemplate.subject,
          html: welcomeTemplate.html,
        }),
        sendMail({
          to: normalizedEmail,
          subject: managerUpdateTemplate.subject,
          html: managerUpdateTemplate.html,
        }),
      ]);

      return NextResponse.json(
        {
          success: true,
          message: "Organization and user created successfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationId: organization._id,
            organizationName: organization.name,
            organizationLogo: organization.logo,
            organizationSubscription: organization.plan || null,
          },
        },
        { status: 201 }
      );
    }

    if (type === "login") {
      const data = validate(loginSchema, body);

      const user = await User.findOne({
        email: data.email,
      }).select("+password");

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isMatch = await user.comparePassword(
        data.password
      );

      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      const token = generateToken({
        userId: user._id.toString(),
        role: user.role,
        organizationId: user.organizationId.toString(),
      });

      const organization = await Organization.findById(
        user.organizationId
      ).select("name slug logo plan");

      const subscription = await Subscription.findOne({
        organization: user.organizationId,
      }).select("endDate status");

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          organizationName: organization?.name || "Organization",
          organizationLogo: organization?.logo || "",
          organizationSubscription: organization?.plan || null,
          subscriptionExpiry: subscription?.endDate || null,
          subscriptionStatus: subscription ? subscription.status : null,
        },
      });

      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid auth type" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";
    console.error("Auth Error:", error);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
