import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Organization from "@/models/Organization";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { organizationId, shiftName, seatNumber } = await req.json();

    // ==========================
    // Basic Validation
    // ==========================
    if (!organizationId || !shiftName || !seatNumber) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (seatNumber <= 0) {
      return NextResponse.json(
        { message: "Invalid seat number" },
        { status: 400 }
      );
    }

    // ==========================
    // Check Organization
    // ==========================
    const organization = await Organization.findById(organizationId);

    if (!organization || !organization.isConfigured) {
      return NextResponse.json(
        { message: "Organization not configured" },
        { status: 400 }
      );
    }

    // ==========================
    // Check Shift Exists
    // ==========================
    const shift = organization.seatConfig?.shifts.find(
      (s: any) => s.shiftName === shiftName
    );

    if (!shift) {
      return NextResponse.json(
        { message: "Shift not found" },
        { status: 404 }
      );
    }

    // ==========================
    // Check Seat Range
    // ==========================
    if (seatNumber > shift.totalSeats) {
      return NextResponse.json(
        { message: "Seat number exceeds shift capacity" },
        { status: 400 }
      );
    }

    // ==========================
    // Check If Seat Already Booked
    // ==========================
    const existingStudent = await Student.findOne({
      organizationId,
      shiftName,
      seatNumber,
      isActive: true,
    });

    if (existingStudent) {
      return NextResponse.json({
        available: false,
      });
    }

    return NextResponse.json({
      available: true,
    });

  } catch (error) {
    console.error("Seat Check Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}