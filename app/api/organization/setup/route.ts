import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Organization from "@/models/Organization";
import { requireAuth } from "@/lib/requireAuth";

interface ShiftInput {
  shiftName: string;
  totalSeats: number;
  startTime?: string;
  endTime?: string;
}

interface SetupPayload {
  totalSeats: number;
  shifts: ShiftInput[];
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function hasOverlap(shifts: ShiftInput[]) {
  const timedShifts = shifts.filter((s) => s.startTime && s.endTime);

  for (let i = 0; i < timedShifts.length; i++) {
    for (let j = i + 1; j < timedShifts.length; j++) {
      const aStart = timeToMinutes(timedShifts[i].startTime as string);
      const aEnd = timeToMinutes(timedShifts[i].endTime as string);
      const bStart = timeToMinutes(timedShifts[j].startTime as string);
      const bEnd = timeToMinutes(timedShifts[j].endTime as string);

      if (aStart < bEnd && bStart < aEnd) {
        return true;
      }
    }
  }

  return false;
}

function validatePayload(payload: SetupPayload) {
  const { totalSeats, shifts } = payload;

  if (!totalSeats || totalSeats <= 0) {
    return "Total seats must be greater than 0";
  }

  if (!Array.isArray(shifts) || shifts.length === 0) {
    return "At least one shift is required";
  }

  for (const shift of shifts) {
    if (!shift.shiftName?.trim()) {
      return "Shift name is required";
    }
    if (!shift.totalSeats || shift.totalSeats <= 0) {
      return "Each shift must have seats greater than 0";
    }
  }

  const totalShiftSeats = shifts.reduce(
    (sum, shift) => sum + Number(shift.totalSeats),
    0
  );

  if (totalShiftSeats > totalSeats) {
    return "Shift seats cannot exceed total seats";
  }

  if (hasOverlap(shifts)) {
    return "Shift timings overlap";
  }

  return null;
}

async function saveSeatConfig(payload: SetupPayload, allowConfiguredUpdate: boolean) {
  await connectDB();
  const auth = await requireAuth();

  const organization = await Organization.findById(auth.organizationId);
  if (!organization) {
    return NextResponse.json({ message: "Organization not found" }, { status: 404 });
  }

  if (!allowConfiguredUpdate && organization.isConfigured) {
    return NextResponse.json(
      { message: "Organization already configured" },
      { status: 400 }
    );
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  organization.seatConfig = {
    totalSeats: payload.totalSeats,
    shifts: payload.shifts,
  };
  organization.isConfigured = true;
  await organization.save();

  return NextResponse.json({
    success: true,
    message: allowConfiguredUpdate
      ? "Shift configuration updated successfully"
      : "Organization configured successfully",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SetupPayload;
    return await saveSeatConfig(body, false);
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as SetupPayload;
    return await saveSeatConfig(body, true);
  } catch {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
