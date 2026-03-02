import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Organization from "@/models/Organization";
import { requireAuth } from "@/lib/requireAuth";
import { getOverlappingShiftNames } from "@/lib/shiftOverlap";
import { normalizeStudentShiftNames } from "@/lib/studentShift";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth();
    const organizationId = auth.organizationId;
    const { shiftName, shiftNames, seatNumber, excludeStudentId } = await req.json();

    const requestedShiftNames = normalizeStudentShiftNames({ shiftName, shiftNames });
    if (requestedShiftNames.length === 0) {
      return NextResponse.json({ message: "At least one shift is required" }, { status: 400 });
    }

    if (seatNumber && seatNumber <= 0) {
      return NextResponse.json({ message: "Invalid seat number" }, { status: 400 });
    }

    const organization = await Organization.findById(organizationId);
    if (!organization || !organization.isConfigured || !organization.seatConfig) {
      return NextResponse.json({ message: "Organization not configured" }, { status: 400 });
    }

    const shifts = organization.seatConfig.shifts || [];
    const totalSeats = organization.seatConfig.totalSeats;

    const overlapSet = new Set<string>();
    requestedShiftNames.forEach((name) =>
      getOverlappingShiftNames(name, shifts).forEach((overlap) => overlapSet.add(overlap))
    );

    if (seatNumber) {
      if (seatNumber > totalSeats) {
        return NextResponse.json(
          { message: `Seat number exceeds total capacity (${totalSeats})` },
          { status: 400 }
        );
      }

      const candidates = await Student.find({
        organizationId,
        seatNumber,
        status: "ACTIVE",
      }).select("name shiftName shiftNames");

      const existingStudent = candidates.find((candidate) => {
        if (
          excludeStudentId &&
          typeof excludeStudentId === "string" &&
          candidate._id?.toString() === excludeStudentId
        ) {
          return false;
        }

        const studentShiftNames = normalizeStudentShiftNames({
          shiftName: candidate.shiftName,
          shiftNames: candidate.shiftNames,
        });
        return studentShiftNames.some((s) => overlapSet.has(s));
      });

      return NextResponse.json({
        available: !existingStudent,
        bookedBy: existingStudent?.name || null,
      });
    }

    const bookedStudents = await Student.find({
      organizationId,
      status: "ACTIVE",
    }).select("seatNumber name shiftName shiftNames");

    const bySeat = new Map<number, { seatNumber: number; studentName: string; shiftNames: string[] }>();
    bookedStudents.forEach((student) => {
      const studentShiftNames = normalizeStudentShiftNames({
        shiftName: student.shiftName,
        shiftNames: student.shiftNames,
      });
      const conflicts = studentShiftNames.some((name) => overlapSet.has(name));
      if (!conflicts || bySeat.has(student.seatNumber)) return;

      bySeat.set(student.seatNumber, {
        seatNumber: student.seatNumber,
        studentName: student.name,
        shiftNames: studentShiftNames,
      });
    });

    return NextResponse.json({
      success: true,
      bookedSeats: Array.from(bySeat.values()),
      totalSeats,
    });
  } catch (error) {
    console.error("Seat Check Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
