import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Organization from "@/models/Organization";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth();
    const organizationId = auth.organizationId;

    const { shiftName, seatNumber } = await req.json();

    // ==========================
    // Validate input
    // ==========================
    if (!shiftName) {
      return NextResponse.json(
        { message: "shiftName is required" },
        { status: 400 }
      );
    }

    if (seatNumber && seatNumber <= 0) {
      return NextResponse.json(
        { message: "Invalid seat number" },
        { status: 400 }
      );
    }

    // ==========================
    // Check organization
    // ==========================
    const organization = await Organization.findById(organizationId);
    if (!organization || !organization.isConfigured) {
      return NextResponse.json(
        { message: "Organization not configured" },
        { status: 400 }
      );
    }

    // ==========================
    // Check shift exists
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
    // Single seat check (optional)
    // ==========================
    if (seatNumber) {
      if (seatNumber > shift.totalSeats) {
        return NextResponse.json(
          { message: "Seat number exceeds shift capacity" },
          { status: 400 }
        );
      }

      const existingStudent = await Student.findOne({
        organizationId,
        shiftName,
        seatNumber,
        status: "ACTIVE", // ✅ fixed from isActive
      });

      return NextResponse.json({
        available: !existingStudent,
        bookedBy: existingStudent?.name || null,
      });
    }

    // ==========================
    // Full shift booked seats (for seat map rendering)
    // ==========================
    const bookedSeats = await Student.find({
      organizationId,
      shiftName,
      status: "ACTIVE", // ✅ only consider active students
    }).select("seatNumber name");

    return NextResponse.json({
      success: true,
      bookedSeats: bookedSeats.map((s) => ({
        seatNumber: s.seatNumber,
        studentName: s.name,
      })),
    });

  } catch (error) {
    console.error("Seat Check Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}