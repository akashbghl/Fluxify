import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { requireAuth } from "@/lib/requireAuth";
import mongoose from "mongoose";
import { normalizeStudentShiftNames } from "@/lib/studentShift";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success";
  date: Date;
}

export async function GET() {
  try {
    await connectDB();

    const auth = await requireAuth();
    const organizationId = auth.organizationId;
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next3Days = new Date(today);
    next3Days.setDate(today.getDate() + 3);

    /* ==========================
       Fetch Expiring Students
    ========================== */
    const expiringStudents = await Student.find({
      organizationId: orgObjectId,
      expiryDate: { $gte: today, $lte: next3Days },
    })
      .select("name expiryDate shiftName shiftNames seatNumber")
      .sort({ expiryDate: 1 })
      .limit(20);

    /* ==========================
       Fetch Recently Booked Seats
       (optional: last 3 days)
    ========================== */
    const bookedSeats = await Student.find({
      organizationId: orgObjectId,
      startDate: { $gte: today },
      status: "ACTIVE",
      seatNumber: { $exists: true },
      $or: [{ shiftName: { $exists: true } }, { shiftNames: { $exists: true } }],
    })
      .select("name startDate shiftName shiftNames seatNumber")
      .sort({ startDate: 1 })
      .limit(20);

    /* ==========================
       Fetch Recent Payments
       (optional: last 3 days)
    ========================== */
    const payments = await Student.find({
      organizationId: orgObjectId,
      feesPaid: { $gt: 0 },
    })
      .select("name feesPaid startDate")
      .sort({ updatedAt: -1 })
      .limit(20);

    /* ==========================
       Map Notifications
    ========================== */
    const notifications: NotificationItem[] = [];

    // Student Expiry Notifications
    expiringStudents.forEach((s) => {
      const shifts = normalizeStudentShiftNames({
        shiftName: s.shiftName,
        shiftNames: s.shiftNames,
      }).join(", ");
      const daysLeft = Math.ceil(
        (new Date(s.expiryDate).getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      notifications.push({
        id: s._id.toString(),
        title: "Subscription Expiry",
        message: `Seat ${s.seatNumber} (Shift: ${shifts || "N/A"}) for ${s.name} expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""} (${s.expiryDate.toLocaleDateString()})`,
        type: "warning",
        date: s.expiryDate,
      });
    });

    // Seat Booking Notifications
    bookedSeats.forEach((s) => {
      const shifts = normalizeStudentShiftNames({
        shiftName: s.shiftName,
        shiftNames: s.shiftNames,
      }).join(", ");
      notifications.push({
        id: s._id.toString(),
        title: "Seat Booked",
        message: `Seat ${s.seatNumber} (${shifts || "N/A"}) is booked for ${s.name} on ${new Date(
          s.startDate
        ).toLocaleDateString()}`,
        type: "info",
        date: s.startDate,
      });
    });

    // Payment Notifications
    payments.forEach((s) => {
      notifications.push({
        id: s._id.toString(),
        title: "Payment Received",
        message: `${s.name} paid ₹${s.feesPaid}`,
        type: "success",
        date: s.startDate,
      });
    });

    // Sort all notifications by date ascending
    notifications.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load notifications";
    console.error("Notifications API Error:", message);

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
