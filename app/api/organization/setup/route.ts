import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Organization from "@/models/Organization";
import { requireAuth } from "@/lib/requireAuth";
import { doShiftsOverlap } from "@/lib/shiftOverlap";
import { maxShiftCountForPlan } from "@/lib/planLimits";

interface ShiftInput {
  shiftName: string;
  totalSeats?: number;
  startTime?: string;
  endTime?: string;
}

interface SetupPayload {
  totalSeats: number;
  shifts: ShiftInput[];
}

function hasOverlap(shifts: ShiftInput[]) {
  for (let i = 0; i < shifts.length; i++) {
    for (let j = i + 1; j < shifts.length; j++) {
      if (doShiftsOverlap(shifts[i], shifts[j])) {
        return true;
      }
    }
  }

  return false;
}

function validatePayload(payload: SetupPayload, plan?: string) {
  const { totalSeats, shifts } = payload;

  if (!totalSeats || totalSeats <= 0) {
    return "Total seats must be greater than 0";
  }

  if (!Array.isArray(shifts) || shifts.length === 0) {
    return "At least one shift is required";
  }

  const maxShifts = maxShiftCountForPlan(plan);
  if (shifts.length > maxShifts) {
    return `Your plan allows up to ${maxShifts} shifts. Please upgrade to add more.`;
  }

  for (const shift of shifts) {
    if (!shift.shiftName?.trim()) {
      return "Shift name is required";
    }
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

  const validationError = validatePayload(payload, organization.plan);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  const normalizedShifts: ShiftInput[] = payload.shifts.map((shift) => ({
    ...shift,
    shiftName: shift.shiftName.trim(),
    totalSeats: payload.totalSeats,
  }));

  organization.seatConfig = {
    totalSeats: payload.totalSeats,
    shifts: normalizedShifts,
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
