"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BellRing,
  Blocks,
  CalendarRange,
  ChartColumn,
  Check,
  CircleAlert,
  Clock3,
  CreditCard,
  Download,
  Layers2,
  LockKeyhole,
  Radar,
  Rows3,
  ScanLine,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import Mnavbar from "@/components/Mnavbar";
import Pricing from "@/components/landingComponents/Pricing";

const modules = [
  {
    icon: <Rows3 size={16} />,
    title: "Admission Desk",
    detail: "Enroll students, assign seat + shift, and collect opening payment in one flow.",
  },
  {
    icon: <Layers2 size={16} />,
    title: "Shift Collision Guard",
    detail: "Overlap-aware logic blocks conflicting seat usage across timing windows.",
  },
  {
    icon: <Clock3 size={16} />,
    title: "Attendance Timeline",
    detail: "Live check-in/check-out stream with searchable daily records.",
  },
  {
    icon: <CreditCard size={16} />,
    title: "Manager Ledger",
    detail: "Manual payment entries with remarks, mode, transaction, and pending fee impact.",
  },
  {
    icon: <BellRing size={16} />,
    title: "Ops Notification Hub",
    detail: "One feed for expiry alerts, payments, attendance, and subscription state.",
  },
  {
    icon: <ChartColumn size={16} />,
    title: "Performance Radar",
    detail: "Spot expiring students, occupancy pressure, and collection trends early.",
  },
];

const proof = [
  { label: "Seat conflicts reduced", value: "92%" },
  { label: "Desk workflow speedup", value: "3.4x" },
  { label: "Average onboarding", value: "18 min" },
  { label: "Ops visibility", value: "Real-time" },
];

export default function HomePageClient() {
  const router = useRouter();
  const { user } = useAuth();
  const [active, setActive] = useState(0);

  const goPrimary = () => {
    if (!user) {
      router.push("/register");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#06070b] dark:text-slate-100">
      <ToastContainer />
      <div className="mx-auto max-w-[1240px] px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <Mnavbar />

        <section className="relative mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b0f18]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(45,212,191,0.12),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(34,197,94,0.1),transparent_30%),linear-gradient(140deg,#ffffff_35%,#f1f5f9_100%)] dark:bg-[radial-gradient(circle_at_85%_12%,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(34,197,94,0.16),transparent_30%),linear-gradient(140deg,#0b0f18_35%,#0f172a_100%)]" />
          <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-teal-100 px-3 py-1 text-xs tracking-wide text-teal-700 dark:border-teal-200/20 dark:bg-teal-300/10 dark:text-teal-200">
                <Sparkles size={13} />
                Fluxify is for Smart Management
              </p>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                The Operating System for
                <span className="block text-teal-300">Library and Seat Based Study Centers</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
                Fluxify is designed for libraries and study centers to manage seats, memberships, and daily operations digitally.
                It simplifies administration with automated access, payments, and real-time management in one platform.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={goPrimary}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-300"
                >
                  Start Free Trial <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Explore Dashboard
                </button>
              </div>
              <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-white/10 dark:bg-black/20">
                  <p className="font-medium text-slate-900 dark:text-white">No payment gateway dependency</p>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">Manager-controlled finance workflow</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-white/10 dark:bg-black/20">
                  <p className="font-medium text-slate-900 dark:text-white">Shift overlap intelligence</p>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">Prevents hidden seat collisions</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur dark:border-white/10 dark:bg-[#0a1322]/90">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Live Control Panel</p>
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[11px] dark:text-emerald-300">
                    synced
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-slate-100 p-3 dark:border-white/10 dark:bg-black/25">
                    <p className="text-slate-500 dark:text-slate-400">Occupied Seats</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">418 / 500</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-100 p-3 dark:border-white/10 dark:bg-black/25">
                    <p className="text-slate-500 dark:text-slate-400">Renewals Due</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">27</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-100 p-3 dark:border-white/10 dark:bg-black/25">
                    <p className="text-slate-500 dark:text-slate-400">Today Check-ins</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">311</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-100 p-3 dark:border-white/10 dark:bg-black/25">
                    <p className="text-slate-500 dark:text-slate-400">Pending Fees</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">INR 68,900</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {[
                    "Seat 42 renewed for 3 months",
                    "Payment logged for Karan Patel",
                    "Shift-3 conflict blocked on Seat 17",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-lg bg-slate-100 p-2 text-xs dark:bg-black/30">
                      <ScanLine size={13} className="mt-0.5 text-teal-300" />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0b101b] dark:shadow-none">
              <p className="text-2xl font-semibold text-teal-300">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-14" id="features">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">Product Modules</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white">
                Built for day-to-day operations
              </h2>
            </div>
            <p className="max-w-sm text-sm text-slate-600 dark:text-slate-400">
              Practical features with strong defaults. No cluttered config maze.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((item, idx) => (
              <button
                key={item.title}
                onMouseEnter={() => setActive(idx)}
                className={`rounded-2xl border p-5 text-left transition ${active === idx
                  ? "border-teal-300/40 bg-teal-400/10"
                  : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#0b101b] dark:hover:border-white/20"
                  }`}
              >
                <div className="inline-flex rounded-lg bg-slate-100 p-2 text-teal-600 dark:bg-black/30 dark:text-teal-300">{item.icon}</div>
                <p className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.detail}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-4 lg:grid-cols-12" id="how">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 dark:border-white/10 dark:bg-[#0b101b] dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Workflow</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">From inquiry to renewal</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { icon: <Users size={14} />, title: "Enroll", desc: "Create student + assign seat and shifts" },
                { icon: <CalendarRange size={14} />, title: "Track", desc: "Daily attendance and expiry windows" },
                { icon: <CreditCard size={14} />, title: "Collect", desc: "Record payments and pending fee updates" },
                { icon: <Radar size={14} />, title: "Act", desc: "Use alerts and reports for retention decisions" },
              ].map((step) => (
                <div key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
                  <div className="inline-flex rounded-md bg-white p-1.5 text-teal-600 dark:bg-white/10 dark:text-teal-300">{step.icon}</div>
                  <p className="mt-2 font-medium text-slate-900 dark:text-white">{step.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5 dark:border-white/10 dark:bg-[#0b101b] dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Security + Trust</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Operational confidence</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { icon: <LockKeyhole size={15} />, text: "Role-aware auth boundaries for staff and managers" },
                { icon: <Blocks size={15} />, text: "Organization-level data segregation by design" },
                { icon: <CircleAlert size={15} />, text: "Critical events surfaced through unified notifications" },
                { icon: <Check size={15} />, text: "Audit-friendly payment and attendance records" },
              ].map((row) => (
                <div key={row.text} className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-slate-700 dark:bg-black/20 dark:text-slate-300">
                  <span className="mt-0.5 text-teal-300">{row.icon}</span>
                  <span>{row.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="app" className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0b101b] dark:shadow-none sm:p-8">
          <div className="grid items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Mobile App</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-white">
                Download Fluxify Android App
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Manage your library on the go with our Android app. Check attendance, process payments, and stay updated with real-time notifications from anywhere.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-500">
                <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 dark:border-white/15 dark:bg-white/5">
                  Android APP
                </span>
                <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 dark:border-white/15 dark:bg-white/5">
                  Direct Download
                </span>
                <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 dark:border-white/15 dark:bg-white/5">
                  Version 1.0.0
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 lg:justify-self-end">
              <a
                href="/fluxify.apk"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 dark:bg-teal-400 dark:text-slate-900 dark:hover:bg-teal-300"
              >
                Download APK <Download size={15} />
              </a>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                Version 1.0.0 - Released March 2026
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <Pricing />
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-100 px-6 py-10 text-center sm:px-10 dark:border-white/10 dark:from-[#0b101b] dark:to-[#101b2d]">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 dark:border-white/20 dark:bg-white/5 dark:text-slate-300">
            Ready to digitalize your Library operations?
          </p>
          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white">
            Start your free trial and experience the difference today.
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Start free, set up in minutes, and scale with confidence as your student base grows.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={goPrimary}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-300"
            >
              Start Free Trial <ArrowRight size={15} />
            </button>
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Sign In
            </button>
          </div>
        </section>

      </div>
      <footer className="mt-16 mx-10 max-md:mx-4 border-t rounded-tl-3xl rounded-tr-3xl border-slate-200 bg-white dark:border-white/10 dark:bg-[#06070b]">
        <div className="mx-auto max-w-[1240px] px-6 py-12 sm:px-10">
          <div className="grid gap-10 grid-cols-2">

            {/* Brand Section */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                Fluxify
              </h4>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                The operating system for modern library and seat-based study centers.
                Built to simplify admissions, attendance, renewals, and operations.
              </p>

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                Built in public by{" "}
                <a
                  href="https://github.com/akashbghl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-teal-500 hover:underline"
                >
                  @akashbghl
                </a>
              </p>
            </div>
            <div className="flex max-md:flex-col ml-auto gap-4">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Connect:
              </p>
              <ul className="flex max-md:flex-col space-x-4 text-sm text-slate-600 dark:text-slate-400">
                {[
                  { label: "Github", href: "https://github.com/akashbghl" },
                  { label: "Linkedin", href: "https://www.linkedin.com/in/akash-baghel-68921a281/" },
                  { label: "Twitter/X", href: "https://x.com/akashbghl" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-white/10 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Fluxify. All rights reserved.
            </p>
            <p>
              Designed for high-efficiency study center operations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
