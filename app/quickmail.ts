import mongoose from "mongoose";
import nodemailer from "nodemailer";

process.loadEnvFile?.(".env.local");

const config = {
  dryRun: false,
  onlyActiveUsers: true,
  limit: 25,
  subject: "Enjoying Fluxify?",
  previewText: "We'd love to hear how Fluxify is working for you.",
  message: `
Hi there,

We hope you're enjoying using Fluxify to manage and streamline your library operations.

Our goal with Fluxify is to make library management simpler, faster, and more reliable. Your experience and feedback play an important role in helping us improve the platform and build features that truly support your workflow.

If you have a moment, we would love to hear from you. Please feel free to reply to this email and share:

• What you like most about Fluxify  
• Any challenges or issues you've experienced  
• Features or improvements you'd love to see  
• Anything that feels slow, confusing, or missing  

Your feedback helps us prioritize updates and continue building a product that genuinely serves your needs.

Thank you for being part of the Fluxify community. We truly appreciate your time and insights.

Best regards,  
The Fluxify Team
`
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildHtml(message: string) {
  return `
    <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
        <div style="padding:28px 28px 12px;background:linear-gradient(135deg,#0f172a 0%, #14b8a6 100%);color:#ffffff;">
          <div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.9;">Fluxify</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">Enjoying Fluxify?</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#334155;">${message}</p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#64748b;">
            Thanks for building with Fluxify.
          </p>
        </div>
      </div>
    </div>
  `;
}

async function main() {
  const MONGODB_URI = requiredEnv("MONGODB_URI");
  const EMAIL_USER = requiredEnv("EMAIL_USER");
  const EMAIL_PASS = requiredEnv("EMAIL_PASS");

  await mongoose.connect(MONGODB_URI, {
    dbName: "nextstep",
    bufferCommands: false,
  });

  const query = config.onlyActiveUsers ? { isActive: true } : {};
  const users = await mongoose.connection
    .collection("users")
    .find(query, {
      projection: { email: 1, name: 1, isActive: 1 },
    })
    .limit(config.limit)
    .toArray();

  if (users.length === 0) {
    console.log("No users found for this email run.");
    return;
  }

  console.log(
    `Loaded ${users.length} user(s). dryRun=${config.dryRun} onlyActiveUsers=${config.onlyActiveUsers} limit=${config.limit}`
  );

  if (config.dryRun) {
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name || "Unknown"})`);
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const html = buildHtml(config.message);
  let sentCount = 0;

  for (const user of users) {
    if (!user.email) {
      continue;
    }

    await transporter.sendMail({
      from: `"Fluxify Team" <${EMAIL_USER}>`,
      to: user.email,
      subject: config.subject,
      text: `${config.previewText}\n\n${config.message}`,
      html,
    });

    sentCount += 1;
    console.log(`Sent to ${user.email}`);
  }

  console.log(`Email run complete. Sent ${sentCount} email(s).`);
}

main()
  .catch((error) => {
    console.error("Quick mail failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
