type EmailTemplate = {
  subject: string;
  html: string;
};

const APP_NAME = "Fluxify";

function wrapTemplate(content: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;">${APP_NAME}</h1>
        ${content}
      </div>
      <p style="max-width:620px;margin:12px auto 0 auto;font-size:12px;color:#64748b;">
        This is an automated message from ${APP_NAME}.
      </p>
    </div>
  `;
}

export function getRegistrationOtpEmailTemplate(params: {
  name?: string;
  otp: string;
  expiryMinutes: number;
}): EmailTemplate {
  const greetingName = params.name?.trim() || "there";
  return {
    subject: `${APP_NAME} Email Verification Code`,
    html: wrapTemplate(`
      <p style="margin:0 0 8px 0;">Hi ${greetingName},</p>
      <p style="margin:0 0 16px 0;">Use the verification code below to continue account creation:</p>
      <div style="font-size:28px;font-weight:700;letter-spacing:6px;padding:14px 16px;background:#f1f5f9;border-radius:10px;display:inline-block;">
        ${params.otp}
      </div>
      <p style="margin:16px 0 0 0;">This code will expire in ${params.expiryMinutes} minutes.</p>
    `),
  };
}

export function getSignupWelcomeEmailTemplate(params: {
  name: string;
  organizationName: string;
  role: string;
}): EmailTemplate {
  return {
    subject: `Welcome to ${APP_NAME}`,
    html: wrapTemplate(`
      <p style="margin:0 0 8px 0;">Hi ${params.name},</p>
      <p style="margin:0 0 10px 0;">Your account has been created successfully.</p>
      <p style="margin:0 0 6px 0;"><strong>Organization:</strong> ${params.organizationName}</p>
      <p style="margin:0 0 6px 0;"><strong>Role:</strong> ${params.role}</p>
      <p style="margin:16px 0 0 0;">You can now log in and complete your setup.</p>
    `),
  };
}

export function getSubscriptionActivatedEmailTemplate(params: {
  recipientName: string;
  organizationName: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  amount?: number;
  currency?: string;
  paymentId?: string;
}): EmailTemplate {
  return {
    subject: `${APP_NAME} Subscription Activated`,
    html: wrapTemplate(`
      <p style="margin:0 0 8px 0;">Hi ${params.recipientName},</p>
      <p style="margin:0 0 12px 0;">Your organization subscription is now active.</p>
      <p style="margin:0 0 6px 0;"><strong>Organization:</strong> ${params.organizationName}</p>
      <p style="margin:0 0 6px 0;"><strong>Plan:</strong> ${params.plan}</p>
      <p style="margin:0 0 6px 0;"><strong>Start Date:</strong> ${params.startDate.toDateString()}</p>
      <p style="margin:0 0 6px 0;"><strong>End Date:</strong> ${params.endDate.toDateString()}</p>
      ${
        typeof params.amount === "number"
          ? `<p style="margin:0 0 6px 0;"><strong>Amount:</strong> ${params.amount} ${params.currency || "INR"}</p>`
          : ""
      }
      ${params.paymentId ? `<p style="margin:0;"><strong>Payment ID:</strong> ${params.paymentId}</p>` : ""}
    `),
  };
}

export function getOrganizationUpdateEmailTemplate(params: {
  recipientName: string;
  organizationName: string;
  updateTitle: string;
  updateMessage: string;
}): EmailTemplate {
  return {
    subject: `${APP_NAME}: ${params.updateTitle}`,
    html: wrapTemplate(`
      <p style="margin:0 0 8px 0;">Hi ${params.recipientName},</p>
      <p style="margin:0 0 10px 0;">${params.updateMessage}</p>
      <p style="margin:0;"><strong>Organization:</strong> ${params.organizationName}</p>
    `),
  };
}

