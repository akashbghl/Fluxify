import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Student from "@/models/Student";
import { validate, paymentSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth();
    const organizationId = auth.organizationId;

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    const filter: Record<string, string> = { organizationId };
    if (studentId) filter.student = studentId;

    const payments = await Payment.find(filter)
      .select(
        "student studentName studentEmail studentPhone amount mode status transactionId remarks paidAt createdAt"
      )
      .populate("student", "name email phone")
      .sort({ paidAt: -1 });

    const normalizedPayments = payments.map((payment) => {
      const item = payment.toObject() as Record<string, unknown>;
      const student = item.student;

      const hasStudent =
        !!student &&
        typeof student === "object" &&
        "name" in (student as Record<string, unknown>);

      if (!hasStudent) {
        item.student = {
          name: (item.studentName as string) || "Deleted Student",
          email: (item.studentEmail as string) || "",
          phone: (item.studentPhone as string) || "",
        };
      }

      return item;
    });

    return NextResponse.json({
      success: true,
      payments: normalizedPayments,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch payments";
    console.error("Fetch Payments Error:", message);

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth();
    const organizationId = auth.organizationId;

    const body = await req.json();
    const data = validate(paymentSchema, body);

    const student = await Student.findOne({
      _id: data.studentId,
      organizationId,
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found or unauthorized",
        },
        { status: 404 }
      );
    }

    const payment = await Payment.create({
      student: data.studentId,
      organizationId,
      studentName: student.name,
      studentEmail: student.email || undefined,
      studentPhone: student.phone || undefined,
      amount: data.amount,
      mode: data.mode,
      transactionId: data.transactionId,
      remarks: data.remarks,
      status: "SUCCESS",
    });

    student.feesPaid += data.amount;
    if (student.pendingFees > 0) {
      student.pendingFees = Math.max(student.pendingFees - data.amount, 0);
    }
    await student.save();

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create payment";
    console.error("Create Payment Error:", message);

    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}

