import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isPublicApi = pathname.startsWith("/api/auth");
  const isDashboard = pathname.startsWith("/dashboard");
  const isApiRoute = pathname.startsWith("/api");
  const isWebhookRoute = pathname === "/api/razorpay/webhook";

  const isCronRoute =
    pathname.startsWith("/api/cron");

  if (isCronRoute) {
    return NextResponse.next();   // allow without auth
  }

  if (isWebhookRoute) {
    return NextResponse.next();   // allow without auth
  }
  const isReminderRoute =
    pathname.startsWith("/api/reminders");
  if (isReminderRoute) {
    return NextResponse.next();   // allow without auth
  }


  // Allow auth API
  if (isPublicApi) {
    return NextResponse.next();
  }

  // Block private routes if not logged in
  if (!token) {
    if (isDashboard || isApiRoute) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
  ],
};
