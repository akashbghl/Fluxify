import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Payment from "@/models/Payment";
import { requireAuth } from "@/lib/requireAuth";
import {
  validate,
  studentCreateSchema,
  studentRenewSchema,
  studentUpdateSchema,
} from "@/lib/validators";
import Organization from "@/models/Organization";
import { getOverlappingShiftNames } from "@/lib/shiftOverlap";
import { getPrimaryShiftName, normalizeStudentShiftNames } from "@/lib/studentShift";
import { canUseMultiShiftEnrollment, isFreePlan } from "@/lib/planLimits";

const PLAN_MAP: Record<string, number> = {
  "1_MONTH": 1,
  "3_MONTH": 3,
  "6_MONTH": 6,
  "12_MONTH": 12,
};

function calculateStatusAndExpiry(startDateRaw: string | Date, plan: string) {
  const startDate = new Date(startDateRaw);
  const expiryDate = new Date(startDate);
  expiryDate.setMonth(expiryDate.getMonth() + PLAN_MAP[plan]);

  const today = new Date();
  const status = expiryDate < today ? "EXPIRED" : "ACTIVE";
  return { startDate, expiryDate, status };
}

function getRequestedShiftNames(payload: { shiftName?: string; shiftNames?: string[] }) {
  return normalizeStudentShiftNames(payload);
}

async function findSeatConflict(params: {
  organizationId: string;
  shiftNames: string[];
  seatNumber: number;
  excludeStudentId?: string;
}) {
  const organization = await Organization.findById(params.organizationId);
  if (!organization?.seatConfig) {
    throw new Error("Organization not configured");
  }

  const shifts = organization.seatConfig.shifts || [];
  const allShiftNames = new Set(shifts.map((s: { shiftName: string }) => s.shiftName));

  for (const shiftName of params.shiftNames) {
    if (!allShiftNames.has(shiftName)) {
      throw new Error(`Invalid shift selected: ${shiftName}`);
    }
  }

  if (params.seatNumber > organization.seatConfig.totalSeats) {
    throw new Error(
      `Seat number exceeds total capacity (${organization.seatConfig.totalSeats})`
    );
  }

  const overlapSet = new Set<string>();
  params.shiftNames.forEach((shiftName) => {
    getOverlappingShiftNames(shiftName, shifts).forEach((name) => overlapSet.add(name));
  });

  const query: {
    organizationId: string;
    seatNumber: number;
    status: "ACTIVE";
    _id?: { $ne: string };
  } = {
    organizationId: params.organizationId,
    seatNumber: params.seatNumber,
    status: "ACTIVE",
  };

  if (params.excludeStudentId) {
    query._id = { $ne: params.excludeStudentId };
  }

  const candidates = await Student.find(query).select("name shiftName shiftNames");

  for (const candidate of candidates) {
    const candidateShiftNames = normalizeStudentShiftNames({
      shiftName: candidate.shiftName,
      shiftNames: candidate.shiftNames,
    });

    const conflictingShift = candidateShiftNames.find((name) => overlapSet.has(name));
    if (conflictingShift) {
      return {
        student: candidate,
        conflictingShift,
      };
    }
  }

  return null;
}

export async function GET() {
  try {
    await connectDB();
    const auth = await requireAuth();
    const students = await Student.find({
      organizationId: auth.organizationId,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, students });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth();
    const organizationId = auth.organizationId;

    const body = await req.json();
    const data = validate(studentCreateSchema, body);
    const shiftNames = getRequestedShiftNames({
      shiftName: body.shiftName ?? data.shiftName,
      shiftNames: body.shiftNames ?? data.shiftNames,
    });

    if (shiftNames.length === 0 || !data.seatNumber) {
      return NextResponse.json(
        { success: false, message: "At least one shift and seat number required" },
        { status: 400 }
      );
    }

    const organization = await Organization.findById(organizationId);
    if (organization?.plan === "FREE" && organization.seatConfig?.totalSeats >= 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Free plan allows max 50 students. Please upgrade your plan.",
        },
        { status: 400 }
      );
    }

    if (isFreePlan(organization?.plan) && !canUseMultiShiftEnrollment(organization?.plan) && shiftNames.length > 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Multi-shift enrollment is available on PRO plan. Please upgrade.",
        },
        { status: 403 }
      );
    }

    const { startDate, expiryDate, status } = calculateStatusAndExpiry(
      data.startDate,
      data.plan
    );

    if (status === "ACTIVE") {
      const conflict = await findSeatConflict({
        organizationId,
        shiftNames,
        seatNumber: data.seatNumber,
      });

      if (conflict) {
        return NextResponse.json(
          {
            success: false,
            message: `Seat ${data.seatNumber} is already occupied in overlapping shift "${conflict.conflictingShift}" by ${conflict.student.name}.`,
          },
          { status: 400 }
        );
      }
    }

    const {
      paymentMode,
      transactionId,
      paymentRemarks,
      ...studentData
    } = data;
    const initialPaidAmount = Number(studentData.feesPaid || 0);

    const student = await Student.create({
      ...studentData,
      feesPaid: initialPaidAmount,
      shiftNames,
      shiftName: getPrimaryShiftName({ shiftNames }),
      startDate,
      expiryDate,
      status,
      organizationId,
    });

    if (initialPaidAmount > 0) {
      try {
        await Payment.create({
          student: student._id,
          organizationId,
          amount: initialPaidAmount,
          mode: paymentMode || "CASH",
          transactionId: transactionId || undefined,
          remarks: paymentRemarks || "Initial enrollment payment",
          status: "SUCCESS",
        });
      } catch (paymentError: unknown) {
        await Student.findByIdAndDelete(student._id);
        const paymentMessage =
          paymentError instanceof Error
            ? paymentError.message
            : "Failed to record initial payment";
        throw new Error(paymentMessage);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student,
      initialPaymentRecorded: initialPaidAmount > 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create student";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth();
    const organizationId = auth.organizationId;

    const body = await req.json();
    const { id, ...payload } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Student ID required" },
        { status: 400 }
      );
    }

    const data = validate(studentUpdateSchema, payload);
    const { ...safeData } = data;

    const existingStudent = await Student.findOne({
      _id: id,
      organizationId,
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const startDate = safeData.startDate ? new Date(safeData.startDate) : existingStudent.startDate;
    const plan = safeData.plan ?? existingStudent.plan;
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + PLAN_MAP[plan]);
    const today = new Date();
    const status = expiryDate < today ? "EXPIRED" : "ACTIVE";

    const nextShiftNamesRaw =
      (Array.isArray(payload.shiftNames) ? payload.shiftNames : undefined) ||
      safeData.shiftNames ||
      (payload.shiftName ? [payload.shiftName] : undefined) ||
      (safeData.shiftName ? [safeData.shiftName] : undefined);
    const nextShiftNames = nextShiftNamesRaw
      ? normalizeStudentShiftNames({
          shiftNames: nextShiftNamesRaw,
        })
      : normalizeStudentShiftNames({
          shiftName: existingStudent.shiftName,
          shiftNames: existingStudent.shiftNames,
        });

    const nextSeatNumber = safeData.seatNumber ?? existingStudent.seatNumber;

    if (nextShiftNames.length === 0 || !nextSeatNumber) {
      return NextResponse.json(
        { success: false, message: "At least one shift and seat number required" },
        { status: 400 }
      );
    }

    const organization = await Organization.findById(organizationId).select("plan");
    if (
      isFreePlan(organization?.plan) &&
      !canUseMultiShiftEnrollment(organization?.plan) &&
      nextShiftNames.length > 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Multi-shift enrollment is available on PRO plan. Please upgrade.",
        },
        { status: 403 }
      );
    }

    if (status === "ACTIVE") {
      const conflict = await findSeatConflict({
        organizationId,
        shiftNames: nextShiftNames,
        seatNumber: nextSeatNumber,
        excludeStudentId: id,
      });

      if (conflict) {
        return NextResponse.json(
          {
            success: false,
            message: `Seat ${nextSeatNumber} is already occupied in overlapping shift "${conflict.conflictingShift}" by ${conflict.student.name}.`,
          },
          { status: 400 }
        );
      }
    }

    const updatedStudent = await Student.findOneAndUpdate(
        { _id: id, organizationId },
      {
        ...safeData,
        shiftNames: nextShiftNames,
        shiftName: getPrimaryShiftName({ shiftNames: nextShiftNames }),
        startDate,
        expiryDate,
        status,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update student";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth();
    const organizationId = auth.organizationId;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Student ID required" },
        { status: 400 }
      );
    }

    const deletedStudent = await Student.findOneAndDelete({
      _id: id,
      organizationId,
    });

    if (!deletedStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found or unauthorized",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth();
    const organizationId = auth.organizationId;

    const body = await req.json();
    const data = validate(studentRenewSchema, body);

    const student = await Student.findOne({
      _id: data.id,
      organizationId,
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const plan = data.plan || student.plan;
    const planMonths = PLAN_MAP[plan];
    if (!planMonths) {
      return NextResponse.json(
        { success: false, message: "Invalid renewal plan" },
        { status: 400 }
      );
    }

    const now = new Date();
    const renewalStartBase =
      student.expiryDate && new Date(student.expiryDate) > now
        ? new Date(student.expiryDate)
        : now;
    const nextExpiry = new Date(renewalStartBase);
    nextExpiry.setMonth(nextExpiry.getMonth() + planMonths);

    student.plan = plan;
    student.startDate = now;
    student.expiryDate = nextExpiry;
    student.status = "ACTIVE";

    const amountPaid = Number(data.amountPaid || 0);
    if (amountPaid > 0) {
      student.feesPaid += amountPaid;
      if (student.pendingFees > 0) {
        student.pendingFees = Math.max(student.pendingFees - amountPaid, 0);
      }

      await Payment.create({
        student: student._id,
        organizationId,
        amount: amountPaid,
        mode: data.paymentMode || "CASH",
        transactionId: data.transactionId || undefined,
        remarks: data.remarks || "Student renewal payment",
        status: "SUCCESS",
      });
    }

    await student.save();

    return NextResponse.json({
      success: true,
      message: "Student renewed successfully",
      student,
      paymentRecorded: amountPaid > 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to renew student";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
