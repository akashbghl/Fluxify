import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { generateToken } from "@/lib/auth";
import {
  validate,
  registerSchema,
  loginSchema,
} from "@/lib/validators";
import { cookies } from "next/headers";
import Subscription from "@/models/Subscription";

/**
 * POST → /api/auth
 * body: { type: "register" | "login", ...payload }
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

    /* ======================
        REGISTER
    ====================== */
    if (type === "register") {
      const data = validate(registerSchema, body);

      const existingUser = await User.findOne({
        email: data.email,
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 409 }
        );
      }

      /* ======================
          Create Organization
      ====================== */

      const slug =
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Date.now();

      const organization = await Organization.create({
        name: data.organizationName,
        slug,
        email: data.email,
        plan: "FREE",
      });

      /* ======================
          Create User
      ====================== */

      const user = await User.create({
        ...data,
        role: "MANAGER",
        organizationId: organization._id,
      });

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

    /* ======================
        LOGIN
    ====================== */
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

      /* ======================
          Generate JWT
      ====================== */

      const token = generateToken({
        userId: user._id.toString(),
        role: user.role,
        organizationId: user.organizationId.toString(),
      });

      // Fetch organization
      const organization = await Organization.findById(
        user.organizationId
      ).select("name slug logo plan");

      const subscription = await Subscription.findOne({
        organization: user.organizationId,
      }).select("endDate");

      /* ======================
          Set Cookie
      ====================== */

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
        },
      });

      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: false,          // ✅ localhost
        sameSite: "lax",        // ✅ works on localhost
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;


    }

    return NextResponse.json(
      { success: false, message: "Invalid auth type" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Auth Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
