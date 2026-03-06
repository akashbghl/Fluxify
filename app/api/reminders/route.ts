import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { sendMail } from "@/lib/mail";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import Subscription from "@/models/Subscription";
import Organization from "@/models/Organization";

interface ReminderStudent {
  name: string;
  email?: string;
  phone?: string;
  expiryDate: Date | string;
  organizationId?: string;
  organization?: string;
}

function getDaysDiff(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

async function notifyStudent(student: ReminderStudent, daysLeft: number) {
  const organizationRef = student.organizationId || student.organization;
  const organization = organizationRef
    ? await Organization.findById(organizationRef).select("name")
    : null;
  const orgName = organization?.name || "Fluxify Team";
  const expiryDate = new Date(student.expiryDate).toDateString();

  const whatsappMessage =
    daysLeft > 0
      ? `Hello ${student.name},

Your library subscription will expire in ${daysLeft} day(s) on ${expiryDate}.

Please renew your subscription to continue uninterrupted access.

If you already renewed, kindly ignore this message.

- ${orgName}`
      : `Hello ${student.name},

Your library subscription expired on ${expiryDate}.

Please renew as soon as possible to avoid service interruption.

If you already renewed, kindly ignore this message.

- ${orgName}`;

  const emailHtml = `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
    <h2 style="color:#111;">Subscription Reminder</h2>

    <p>Hello <strong>${student.name}</strong>,</p>

    <p>
      This is a gentle reminder that your library subscription
      <strong>${daysLeft >= 0 ? "is about to expire" : "has expired"}</strong>.
    </p>

    <p>
      <strong>Expiry Date:</strong> ${expiryDate} <br/>
      <strong>Days Remaining:</strong> ${daysLeft >= 0 ? daysLeft : "Expired"}
    </p>

    <p>
      To continue enjoying uninterrupted services, please renew your subscription
      at your earliest convenience.
    </p>

    <p style="background:#f5f5f5;padding:12px;border-radius:6px;">
      If you have already renewed, kindly ignore this message.
    </p>

    <p>For any assistance, feel free to contact the library admin.</p>

    <br/>

    <p>
      Regards,<br/>
      <strong>${orgName}</strong>
    </p>
  </div>
  `;

  if (student.email) {
    try {
      console.log(`Sending email reminder to ${student.email}`);
      await sendMail({
        to: student.email,
        subject: "Subscription Reminder",
        html: emailHtml,
      });
    } catch (err) {
      console.error("Email reminder failed for", student.email, err);
    }
  }

  if (student.phone) {
    try {
      console.log(`Sending WhatsApp reminder to ${student.phone}`);
      await sendWhatsAppMessage({
        to: student.phone,
        message: whatsappMessage,
      });
    } catch (err) {
      console.error("WhatsApp reminder failed for", student.phone, err);
    }
  }
}

async function processReminders(days: number) {
  await connectDB();

  const now = new Date();

  const expireResult = await Student.updateMany(
    {
      expiryDate: { $lte: now },
      status: "ACTIVE",
    },
    {
      $set: { status: "EXPIRED" },
    }
  );

  console.log(`Auto expired students: ${expireResult.modifiedCount}`);

  const orgExpireResult = await Subscription.updateMany(
    {
      endDate: { $lte: now },
      status: "ACTIVE",
    },
    {
      $set: { status: "EXPIRED" },
    }
  );

  console.log(`Auto expired subscriptions: ${orgExpireResult.modifiedCount}`);

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + days);

  const students = await Student.find({
    expiryDate: {
      $lte: targetDate,
    },
  });

  let sentCount = 0;

  for (const student of students) {
    const daysLeft = getDaysDiff(new Date(student.expiryDate));
    console.log(`Reminder check for ${student.name}: ${daysLeft} day(s) left`);

    if ([3, 1, 0].includes(daysLeft)) {
      await notifyStudent(student, daysLeft);
      sentCount++;
    }

    if ([-1, -3, -7, -15, -30].includes(daysLeft)) {
      await notifyStudent(student, daysLeft);
      sentCount++;
    }
  }

  return {
    expiredUpdated: expireResult.modifiedCount,
    subscriptionExpiredUpdated: orgExpireResult.modifiedCount,
    remindersSent: sentCount,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") ?? 3);

    const result = await processReminders(days);

    return NextResponse.json({
      success: true,
      message: "Reminders executed successfully",
      ...result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reminder execution failed";
    console.error("Reminder GET Error:", message);

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") ?? 3);

    const result = await processReminders(days);

    return NextResponse.json({
      success: true,
      message: "Reminders executed successfully",
      ...result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reminder execution failed";
    console.error("Reminder POST Error:", message);

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
