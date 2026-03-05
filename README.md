# Fluxify

Fluxify is a multi-tenant SaaS platform for libraries and study centers to manage:
- student enrollment and renewals
- seat and shift allocation (with overlap conflict checks)
- attendance check-in/check-out
- payment tracking
- subscription plans and notifications

Built with Next.js App Router, TypeScript, MongoDB, Tailwind CSS, and Razorpay.

## Live URL
- `https://fluxifyio.vercel.app`

## Core Features

### 1. Organization and Auth
- Organization + manager account is created during registration
- JWT-based session with HTTP-only cookie
- Middleware-protected dashboard and private APIs

### 2. Student Management
- Add, edit, delete students
- Plan durations: `1_MONTH`, `3_MONTH`, `6_MONTH`, `12_MONTH`
- Multi-shift support (plan-gated)
- Student renewal API (`PATCH /api/students`) with optional payment entry

### 3. Seat + Shift Logic
- Seat capacity is fixed per organization
- Shift overlap collision detection prevents double seat allocation
- Supports single and multi-shift enrollment (depending on plan limits)

### 4. Attendance
- Manual check-in/check-out
- Day-wise attendance records
- Dashboard attendance metrics

### 5. Payments
- Manager-entered payment records
- Payment-to-student linkage
- Auto-updates `feesPaid` and `pendingFees`

### 6. Subscription / Billing
- Razorpay order initiation + verification + webhook support
- Organization plan status updates via subscription workflow

### 7. Notifications API
- Unified notifications from:
  - student expiry/renewal/enrollment
  - payments
  - attendance
  - subscription states
- Supports category filtering and limit query params

### 8. Landing + SEO
- Theme-aware landing page (light/dark)
- Dynamic `robots.txt` and `sitemap.xml`
- OpenGraph/Twitter metadata + structured data

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide Icons
- Framer Motion
- React Toastify

### Backend
- Next.js Route Handlers (`app/api/*`)
- MongoDB + Mongoose
- JWT auth
- Zod validation

### Integrations
- Razorpay (subscriptions/payments)
- Nodemailer (email reminders)
- Twilio WhatsApp (optional messaging)
- node-cron (scheduled tasks)

---

## Project Structure

```txt
app/
  (auth)/                 # login/register pages
  dashboard/              # protected SaaS UI
  api/                    # route handlers
  robots.ts               # dynamic robots.txt
  sitemap.ts              # dynamic sitemap.xml

components/
  layout/                 # dashboard layout components
  students/               # student UI blocks/forms/cards
  landing*/               # homepage + pricing components

hooks/
  useAuth.ts              # auth + org state on client

lib/
  auth.ts                 # JWT helpers
  db.ts                   # Mongo connection
  requireAuth.ts          # cookie-auth guard for APIs
  validators.ts           # zod schemas
  studentShift.ts         # shift normalization
  shiftOverlap.ts         # overlap detection logic
  planLimits.ts           # FREE/PRO feature gates
  mail.ts / whatsapp.ts   # communication helpers

models/
  User.ts
  Organization.ts
  Student.ts
  Payment.ts
  Attendance.ts
  Subscription.ts
```

---

## API Overview

### Auth
- `POST /api/auth` (`type: "register" | "login"`)
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Organization
- `POST /api/organization/setup`

### Students
- `GET /api/students`
- `POST /api/students` (create)
- `PUT /api/students` (update)
- `PATCH /api/students` (renew)
- `DELETE /api/students?id=...`
- `POST /api/students/check-seat`

### Attendance
- `GET /api/attendance`
- `POST /api/attendance` (check-in)
- `PUT /api/attendance` (check-out)

### Payments
- `GET /api/payments`
- `POST /api/payments`

### Dashboard / Settings / Notifications
- `GET /api/dashboard`
- `GET|PUT /api/settings`
- `GET /api/notifications`

### Subscription + Razorpay
- `POST /api/razorpay/initiate-payment`
- `POST /api/razorpay/verify-payment`
- `POST /api/razorpay/webhook`

### Cron / Reminder
- `GET /api/reminders`
- `GET /api/cron/expire-students?secret=...`

---

## Environment Variables

Create `.env.local` in project root:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# DB
MONGODB_URI=mongodb+srv://...

# Auth
JWT_SECRET=your_jwt_secret

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxx
RAZORPAY_LIVE_KEY=rzp_test_xxx
RAZORPAY_LIVE_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cron security
CRON_SECRET=your_cron_secret

# Mail (optional)
EMAIL_USER=you@example.com
EMAIL_PASS=app_password

# Twilio WhatsApp (optional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Notes:
- In production, ensure secure cookie behavior and HTTPS are configured correctly.
- If you are not using email/WhatsApp reminders, keep those integrations disabled.

---

## Local Development

### Prerequisites
- Node.js 18+ (recommended)
- npm
- MongoDB instance

### Install
```bash
npm install
```

### Run
```bash
npm run dev
```

Open `http://localhost:3000`.

### Lint
```bash
npm run lint
```

### Build
```bash
npm run build
npm run start
```

---

## Default SaaS Workflow

1. Register manager account
2. Complete organization setup (seats/shifts)
3. Add students with plan + seat + shift(s)
4. Mark attendance daily
5. Record payments and monitor pending fees
6. Renew students from student listing
7. Track expiring students and notifications
8. Upgrade subscription if needed

---

## SEO

Fluxify includes:
- metadata in `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- homepage structured data in `app/page.tsx`

To finalize SEO in production:
- set correct `NEXT_PUBLIC_APP_URL`
- submit sitemap in Google Search Console
- add a branded OG image

---

## Deployment

Recommended: Vercel

1. Push repo to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy
5. Configure webhook endpoints and cron secret routes

---

## Security Notes

- APIs under `/api/*` and pages under `/dashboard/*` are middleware-protected
- Webhook/reminder/cron routes are intentionally exempted in middleware logic
- Keep secrets only in env vars
- Validate all incoming payloads via `zod`

---

## License
