import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";
import User from "@/models/User";
import Organization from "@/models/Organization";

export async function GET() {
  try {
    await connectDB();

    const auth = await requireAuth();

    const user = await User.findById(auth.userId).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const organization = await Organization.findById(
      user.organizationId
    ).lean();
    console.log('organizationPlan', organization?.plan);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        organizationId: organization?._id,
        organizationName: organization?.name || "",
        organizationLogo: organization?.logo || "",
        organizationSubscription: organization?.plan,
      },
    });
  } catch (error: any) {
    console.error("Auth Me Error:", error.message);

    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
