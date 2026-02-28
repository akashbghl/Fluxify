import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { requireAuth } from "@/lib/requireAuth";
import {
  validate,
  studentCreateSchema,
  studentUpdateSchema,
} from "@/lib/validators";
import Organization from "@/models/Organization";


/* ============================
   GET → Fetch students (ORG SAFE)
============================ */
export async function GET() {
  try {
    await connectDB();

    const auth = await requireAuth();   // ✅ Extract from cookie
    const organizationId = auth.organizationId;

    const students = await Student.find({
      organizationId,
    }).sort({ createdAt: -1 });


    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error: any) {
    console.error("Fetch Students Error:", error.message);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
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

    if (!data.shiftName || !data.seatNumber) {
      return NextResponse.json(
        { success: false, message: "Shift and seat number required" },
        { status: 400 }
      );
    }

    /* ============================
       Calculate Expiry
    ============================ */

    const PLAN_MAP: Record<string, number> = {
      "1_MONTH": 1,
      "3_MONTH": 3,
      "6_MONTH": 6,
      "12_MONTH": 12,
    };

    const startDate = new Date(data.startDate);
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(
      expiryDate.getMonth() + PLAN_MAP[data.plan]
    );

    const today = new Date();
    const status =
      expiryDate < today ? "EXPIRED" : "ACTIVE";

    const organization = await Organization.findById(organizationId);
    if(organization?.plan === "FREE" && organization.seatConfig?.totalSeats>=50) {
      return NextResponse.json(
        { success: false, message: "Free plan allows max 50 students. Please upgrade your plan." },
        { status: 400 }
      );    
    }
         
    const student = await Student.create({
      ...data,
      startDate,
      expiryDate,
      status,
      organizationId,
    });

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student,
    });

  } catch (error: any) {

    /* HANDLE DUPLICATE SEAT ERROR */
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Seat already booked in this shift",
        },
        { status: 400 }
      );
    }

    console.error("Create Student Error:", error.message);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
// update student
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

    /* ============================
       Fetch existing student
    ============================ */

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

    /* ============================
       Recalculate Expiry
    ============================ */

    const PLAN_MAP: Record<string, number> = {
      "1_MONTH": 1,
      "3_MONTH": 3,
      "6_MONTH": 6,
      "12_MONTH": 12,
    };

    const startDate = data.startDate
      ? new Date(data.startDate)
      : existingStudent.startDate;

    const plan = data.plan ?? existingStudent.plan;

    const expiryDate = new Date(startDate);
    expiryDate.setMonth(
      expiryDate.getMonth() + PLAN_MAP[plan]
    );

    const today = new Date();
    const status =
      expiryDate < today ? "EXPIRED" : "ACTIVE";

    /* ============================
       Final update payload
    ============================ */

    const updatePayload = {
      ...data,
      startDate,
      expiryDate,
      status,
    };

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: id, organizationId },
      updatePayload,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });

  } catch (error: any) {

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Seat already booked in this shift",
        },
        { status: 400 }
      );
    }

    console.error("Update Student Error:", error.message);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}


/* ============================
   DELETE → Remove student (ORG SAFE)
============================ */
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth();   // ✅ Extract from cookie
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
      organizationId, // ✅ org protected
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
  } catch (error: any) {
    console.error("Delete Student Error:", error.message);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
