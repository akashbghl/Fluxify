import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";
import Student from "@/models/Student";
import Payment from "@/models/Payment";
import Attendance from "@/models/Attendance";
import Subscription from "@/models/Subscription";
import { normalizeStudentShiftNames } from "@/lib/studentShift";

type NotificationType = "warning" | "info" | "success";
type NotificationCategory =
  | "STUDENT_EXPIRY_SOON"
  | "STUDENT_EXPIRED"
  | "STUDENT_ENROLLED"
  | "STUDENT_RENEWED"
  | "PAYMENT_RECEIVED"
  | "ATTENDANCE_CHECKIN"
  | "ATTENDANCE_CHECKOUT"
  | "SUBSCRIPTION_PENDING"
  | "SUBSCRIPTION_ACTIVE"
  | "SUBSCRIPTION_EXPIRY_SOON"
  | "SUBSCRIPTION_EXPIRED";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  createdAt: string;
  entityId?: string;
  entityType?: "student" | "payment" | "attendance" | "subscription";
}

const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;
const RECENT_DAYS = 7;
const EXPIRY_SOON_DAYS = 3;

function parseLimit(raw: string | null) {
  const parsed = Number(raw || DEFAULT_LIMIT);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

function parseCategories(raw: string | null): Set<NotificationCategory> | null {
  if (!raw) return null;
  const values = raw
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean) as NotificationCategory[];
  return values.length > 0 ? new Set(values) : null;
}

function shouldInclude(
  category: NotificationCategory,
  categoriesFilter: Set<NotificationCategory> | null
) {
  if (!categoriesFilter) return true;
  return categoriesFilter.has(category);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = await requireAuth();
    const organizationId = auth.organizationId;

    const { searchParams } = new URL(req.url);
    const limit = parseLimit(searchParams.get("limit"));
    const categoriesFilter = parseCategories(searchParams.get("categories"));

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const recentSince = new Date(now);
    recentSince.setDate(recentSince.getDate() - RECENT_DAYS);

    const expirySoonUntil = new Date(startOfToday);
    expirySoonUntil.setDate(expirySoonUntil.getDate() + EXPIRY_SOON_DAYS);

    const [
      expiringStudents,
      recentlyExpiredStudents,
      recentStudents,
      recentPayments,
      recentAttendance,
      latestSubscription,
    ] = await Promise.all([
      Student.find({
        organizationId,
        expiryDate: { $gte: startOfToday, $lte: expirySoonUntil },
      })
        .select("name expiryDate shiftName shiftNames seatNumber")
        .sort({ expiryDate: 1 })
        .limit(limit)
        .lean(),
      Student.find({
        organizationId,
        expiryDate: { $lt: startOfToday, $gte: recentSince },
        status: "EXPIRED",
      })
        .select("name expiryDate shiftName shiftNames seatNumber")
        .sort({ expiryDate: -1 })
        .limit(limit)
        .lean(),
      Student.find({
        organizationId,
        createdAt: { $gte: recentSince },
      })
        .select("name seatNumber shiftName shiftNames createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      Payment.find({
        organizationId,
        paidAt: { $gte: recentSince },
        status: "SUCCESS",
      })
        .select("student amount mode remarks paidAt")
        .populate("student", "name")
        .sort({ paidAt: -1 })
        .limit(limit)
        .lean(),
      Attendance.find({
        organizationId,
        date: { $gte: recentSince },
      })
        .select("student checkIn checkOut source date createdAt")
        .populate("student", "name")
        .sort({ checkIn: -1 })
        .limit(limit)
        .lean(),
      Subscription.findOne({
        organization: organizationId,
      })
        .select("status plan startDate endDate createdAt updatedAt")
        .sort({ updatedAt: -1 })
        .lean(),
    ]);

    const notifications: NotificationItem[] = [];

    expiringStudents.forEach((student) => {
      if (!shouldInclude("STUDENT_EXPIRY_SOON", categoriesFilter)) return;
      const expiryDate = new Date(student.expiryDate);
      const daysLeft = Math.max(
        0,
        Math.ceil((expiryDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24))
      );
      const shifts = normalizeStudentShiftNames({
        shiftName: student.shiftName,
        shiftNames: student.shiftNames,
      }).join(", ");

      notifications.push({
        id: `student-expiry-soon-${student._id.toString()}`,
        title: "Student Expiring Soon",
        message: `${student.name} (Seat ${student.seatNumber}, ${shifts || "No shift"}) expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"} on ${formatDate(expiryDate)}.`,
        type: "warning",
        category: "STUDENT_EXPIRY_SOON",
        createdAt: expiryDate.toISOString(),
        entityId: student._id.toString(),
        entityType: "student",
      });
    });

    recentlyExpiredStudents.forEach((student) => {
      if (!shouldInclude("STUDENT_EXPIRED", categoriesFilter)) return;
      const expiryDate = new Date(student.expiryDate);
      const shifts = normalizeStudentShiftNames({
        shiftName: student.shiftName,
        shiftNames: student.shiftNames,
      }).join(", ");

      notifications.push({
        id: `student-expired-${student._id.toString()}`,
        title: "Student Expired",
        message: `${student.name} (Seat ${student.seatNumber}, ${shifts || "No shift"}) expired on ${formatDate(expiryDate)}.`,
        type: "warning",
        category: "STUDENT_EXPIRED",
        createdAt: expiryDate.toISOString(),
        entityId: student._id.toString(),
        entityType: "student",
      });
    });

    recentStudents.forEach((student) => {
      const createdAt = new Date(student.createdAt);
      const updatedAt = new Date(student.updatedAt || student.createdAt);
      const shifts = normalizeStudentShiftNames({
        shiftName: student.shiftName,
        shiftNames: student.shiftNames,
      }).join(", ");

      if (
        shouldInclude("STUDENT_ENROLLED", categoriesFilter) &&
        createdAt >= recentSince
      ) {
        notifications.push({
          id: `student-enrolled-${student._id.toString()}`,
          title: "Student Enrolled",
          message: `${student.name} enrolled on Seat ${student.seatNumber} (${shifts || "No shift"}).`,
          type: "info",
          category: "STUDENT_ENROLLED",
          createdAt: createdAt.toISOString(),
          entityId: student._id.toString(),
          entityType: "student",
        });
      }

      if (
        shouldInclude("STUDENT_RENEWED", categoriesFilter) &&
        updatedAt > createdAt &&
        updatedAt >= recentSince
      ) {
        notifications.push({
          id: `student-renewed-${student._id.toString()}-${updatedAt.getTime()}`,
          title: "Student Updated/Renewed",
          message: `${student.name} details were updated on ${formatDate(updatedAt)}.`,
          type: "info",
          category: "STUDENT_RENEWED",
          createdAt: updatedAt.toISOString(),
          entityId: student._id.toString(),
          entityType: "student",
        });
      }
    });

    recentPayments.forEach((payment) => {
      const paidAt = new Date(payment.paidAt);
      const studentName =
        payment.student && typeof payment.student === "object" && "name" in payment.student
          ? String(payment.student.name || "Student")
          : "Student";
      const remarks = String(payment.remarks || "");
      const isRenewal = /renew/i.test(remarks);

      if (shouldInclude("PAYMENT_RECEIVED", categoriesFilter)) {
        notifications.push({
          id: `payment-${payment._id.toString()}`,
          title: "Payment Received",
          message: `${studentName} paid INR ${payment.amount} via ${payment.mode}.`,
          type: "success",
          category: "PAYMENT_RECEIVED",
          createdAt: paidAt.toISOString(),
          entityId: payment._id.toString(),
          entityType: "payment",
        });
      }

      if (isRenewal && shouldInclude("STUDENT_RENEWED", categoriesFilter)) {
        notifications.push({
          id: `renewal-payment-${payment._id.toString()}`,
          title: "Student Renewal",
          message: `${studentName} renewal payment recorded (INR ${payment.amount}).`,
          type: "success",
          category: "STUDENT_RENEWED",
          createdAt: paidAt.toISOString(),
          entityId: payment._id.toString(),
          entityType: "payment",
        });
      }
    });

    recentAttendance.forEach((record) => {
      const studentName =
        record.student && typeof record.student === "object" && "name" in record.student
          ? String(record.student.name || "Student")
          : "Student";

      if (shouldInclude("ATTENDANCE_CHECKIN", categoriesFilter)) {
        notifications.push({
          id: `attendance-checkin-${record._id.toString()}`,
          title: "Attendance Check-In",
          message: `${studentName} checked in (${record.source}) at ${new Date(
            record.checkIn
          ).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}.`,
          type: "info",
          category: "ATTENDANCE_CHECKIN",
          createdAt: new Date(record.checkIn).toISOString(),
          entityId: record._id.toString(),
          entityType: "attendance",
        });
      }

      if (record.checkOut && shouldInclude("ATTENDANCE_CHECKOUT", categoriesFilter)) {
        notifications.push({
          id: `attendance-checkout-${record._id.toString()}`,
          title: "Attendance Check-Out",
          message: `${studentName} checked out at ${new Date(record.checkOut).toLocaleTimeString(
            "en-IN",
            { hour: "2-digit", minute: "2-digit" }
          )}.`,
          type: "info",
          category: "ATTENDANCE_CHECKOUT",
          createdAt: new Date(record.checkOut).toISOString(),
          entityId: record._id.toString(),
          entityType: "attendance",
        });
      }
    });

    if (latestSubscription) {
      const subscriptionUpdatedAt = new Date(
        latestSubscription.updatedAt || latestSubscription.createdAt
      );
      const subscriptionEndDate = new Date(latestSubscription.endDate);
      const daysLeft = Math.ceil(
        (subscriptionEndDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (
        latestSubscription.status === "PENDING" &&
        shouldInclude("SUBSCRIPTION_PENDING", categoriesFilter)
      ) {
        notifications.push({
          id: `subscription-pending-${latestSubscription._id.toString()}`,
          title: "Subscription Pending",
          message: `${latestSubscription.plan} subscription is pending activation.`,
          type: "warning",
          category: "SUBSCRIPTION_PENDING",
          createdAt: subscriptionUpdatedAt.toISOString(),
          entityId: latestSubscription._id.toString(),
          entityType: "subscription",
        });
      }

      if (
        latestSubscription.status === "ACTIVE" &&
        shouldInclude("SUBSCRIPTION_ACTIVE", categoriesFilter)
      ) {
        notifications.push({
          id: `subscription-active-${latestSubscription._id.toString()}`,
          title: "Subscription Active",
          message: `${latestSubscription.plan} subscription is active.`,
          type: "success",
          category: "SUBSCRIPTION_ACTIVE",
          createdAt: subscriptionUpdatedAt.toISOString(),
          entityId: latestSubscription._id.toString(),
          entityType: "subscription",
        });
      }

      if (
        latestSubscription.status === "ACTIVE" &&
        daysLeft >= 0 &&
        daysLeft <= EXPIRY_SOON_DAYS &&
        shouldInclude("SUBSCRIPTION_EXPIRY_SOON", categoriesFilter)
      ) {
        notifications.push({
          id: `subscription-expiry-soon-${latestSubscription._id.toString()}`,
          title: "Subscription Expiring Soon",
          message: `${latestSubscription.plan} plan expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"} on ${formatDate(subscriptionEndDate)}.`,
          type: "warning",
          category: "SUBSCRIPTION_EXPIRY_SOON",
          createdAt: subscriptionEndDate.toISOString(),
          entityId: latestSubscription._id.toString(),
          entityType: "subscription",
        });
      }

      if (
        (latestSubscription.status === "EXPIRED" || daysLeft < 0) &&
        shouldInclude("SUBSCRIPTION_EXPIRED", categoriesFilter)
      ) {
        notifications.push({
          id: `subscription-expired-${latestSubscription._id.toString()}`,
          title: "Subscription Expired",
          message: `${latestSubscription.plan} plan expired on ${formatDate(subscriptionEndDate)}.`,
          type: "warning",
          category: "SUBSCRIPTION_EXPIRED",
          createdAt: subscriptionEndDate.toISOString(),
          entityId: latestSubscription._id.toString(),
          entityType: "subscription",
        });
      }
    }

    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const slicedNotifications = notifications.slice(0, limit);
    const summary = slicedNotifications.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      count: slicedNotifications.length,
      notifications: slicedNotifications,
      summary,
      meta: {
        recentWindowDays: RECENT_DAYS,
        expirySoonDays: EXPIRY_SOON_DAYS,
        limit,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load notifications";
    console.error("Notifications API Error:", message);

    return NextResponse.json(
      { success: false, message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
