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
    <div className="min-h-screen bg-[#06070b] text-slate-100">
      <ToastContainer />
      <div className="mx-auto max-w-[1240px] px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <Mnavbar />

        <section className="relative mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0f18]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(34,197,94,0.16),transparent_30%),linear-gradient(140deg,#0b0f18_35%,#0f172a_100%)]" />
          <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-teal-300/10 px-3 py-1 text-xs tracking-wide text-teal-200">
                <Sparkles size={13} />
                Purpose-built for library operations
              </p>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                The Operating System for
                <span className="block text-teal-300">Seat-Based Study Centers</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Fluxify is designed around your real daily motions, admissions, renewals,
                attendance, collection, and seat control. It feels like software built by someone
                who has actually managed the desk.
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
                  className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Dashboard
                </button>
              </div>
              <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="font-medium text-white">No payment gateway dependency</p>
                  <p className="mt-1 text-slate-400">Manager-controlled finance workflow</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="font-medium text-white">Shift overlap intelligence</p>
                  <p className="mt-1 text-slate-400">Prevents hidden seat collisions</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-[#0a1322]/90 p-4 backdrop-blur">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="text-sm font-semibold text-white">Live Control Panel</p>
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[11px] text-emerald-300">
                    synced
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <p className="text-slate-400">Occupied Seats</p>
                    <p className="mt-1 text-lg font-semibold text-white">418 / 500</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <p className="text-slate-400">Renewals Due</p>
                    <p className="mt-1 text-lg font-semibold text-white">27</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <p className="text-slate-400">Today Check-ins</p>
                    <p className="mt-1 text-lg font-semibold text-white">311</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <p className="text-slate-400">Pending Fees</p>
                    <p className="mt-1 text-lg font-semibold text-white">INR 68,900</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {[
                    "Seat 42 renewed for 3 months",
                    "Payment logged for Karan Patel",
                    "Shift-3 conflict blocked on Seat 17",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-lg bg-black/30 p-2 text-xs">
                      <ScanLine size={13} className="mt-0.5 text-teal-300" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-[#0b101b] p-4">
              <p className="text-2xl font-semibold text-teal-300">{item.value}</p>
              <p className="mt-1 text-xs text-slate-400">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Product Modules</p>
              <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                Built for day-to-day operations
              </h2>
            </div>
            <p className="max-w-sm text-sm text-slate-400">
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
                  : "border-white/10 bg-[#0b101b] hover:border-white/20"
                  }`}
              >
                <div className="inline-flex rounded-lg bg-black/30 p-2 text-teal-300">{item.icon}</div>
                <p className="mt-3 text-base font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-4 lg:grid-cols-12">
          <div className="rounded-2xl border border-white/10 bg-[#0b101b] p-6 lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Workflow</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">From inquiry to renewal</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { icon: <Users size={14} />, title: "Enroll", desc: "Create student + assign seat and shifts" },
                { icon: <CalendarRange size={14} />, title: "Track", desc: "Daily attendance and expiry windows" },
                { icon: <CreditCard size={14} />, title: "Collect", desc: "Record payments and pending fee updates" },
                { icon: <Radar size={14} />, title: "Act", desc: "Use alerts and reports for retention decisions" },
              ].map((step) => (
                <div key={step.title} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="inline-flex rounded-md bg-white/10 p-1.5 text-teal-300">{step.icon}</div>
                  <p className="mt-2 font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b101b] p-6 lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Security + Trust</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Operational confidence</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { icon: <LockKeyhole size={15} />, text: "Role-aware auth boundaries for staff and managers" },
                { icon: <Blocks size={15} />, text: "Organization-level data segregation by design" },
                { icon: <CircleAlert size={15} />, text: "Critical events surfaced through unified notifications" },
                { icon: <Check size={15} />, text: "Audit-friendly payment and attendance records" },
              ].map((row) => (
                <div key={row.text} className="flex items-start gap-2 rounded-lg bg-black/20 p-3 text-slate-300">
                  <span className="mt-0.5 text-teal-300">{row.icon}</span>
                  <span>{row.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <Pricing />
        </section>

        <section className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0b101b] to-[#101b2d] px-6 py-10 text-center sm:px-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <Sparkles size={13} /> Ready to modernize your desk operations?
          </p>
          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Upgrade from spreadsheet chaos to a system your team actually enjoys using
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
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
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign In
            </button>
          </div>
        </section>

        <footer className="mt-10 border-t border-white/10 py-6 text-center text-sm text-slate-500">
          Copyright {new Date().getFullYear()} Fluxify. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
