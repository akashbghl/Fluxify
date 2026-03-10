import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Mnavbar from "@/components/Mnavbar";

const installSteps = [
  {
    title: "Download the APK",
    detail: "Get the latest Android package directly from Fluxify without any external app store redirect.",
  },
  {
    title: "Allow installation",
    detail: "If prompted, enable installs from your browser or file manager for this one-time setup.",
  },
  {
    title: "Sign in and manage",
    detail: "Open the app, sign in with your Fluxify account, and continue operations on the go.",
  },
];

const releaseNotes = [
  "Attendance and payment tracking from mobile.",
  "Real-time notifications for renewals and operational activity.",
  "Cleaner dashboard experience for daily library workflows.",
];

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Download the Fluxify Android app to manage attendance, payments, reminders, and library operations from your phone.",
  alternates: {
    canonical: "/downloads",
  },
};

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#06070b] dark:text-slate-100">
      <div className="mx-auto max-w-[1240px] px-4 pb-16 pt-2 sm:px-6 lg:px-8">
        <Mnavbar />

        <section className="relative mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b0f18]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(45,212,191,0.14),transparent_30%),radial-gradient(circle_at_12%_88%,rgba(14,165,233,0.14),transparent_34%),linear-gradient(140deg,#ffffff_35%,#e2e8f0_100%)] dark:bg-[radial-gradient(circle_at_85%_12%,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_12%_88%,rgba(14,165,233,0.16),transparent_34%),linear-gradient(140deg,#0b0f18_35%,#0f172a_100%)]" />
          <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-teal-100 px-3 py-1 text-xs tracking-wide text-teal-700 dark:border-teal-200/20 dark:bg-teal-300/10 dark:text-teal-200">
                <Sparkles size={13} />
                Mobile access for library operations
              </p>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                Download the
                <span className="block text-teal-400">Fluxify Android App</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
                Take attendance, review payments, and monitor operational updates from your phone without returning to the desktop dashboard.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/fluxify.apk"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-300"
                >
                  Download APK <Download size={15} />
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Back to Home <ArrowRight size={15} />
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 dark:border-white/15 dark:bg-white/5">
                  Android APK
                </span>
                <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 dark:border-white/15 dark:bg-white/5">
                  Version 1.0.0
                </span>
                <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 dark:border-white/15 dark:bg-white/5">
                  Updated March 2026
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 backdrop-blur dark:border-white/10 dark:bg-[#0a1322]/90">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Release Snapshot</p>
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                    latest build
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-white/10 dark:bg-black/20">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <Smartphone size={16} className="text-teal-500 dark:text-teal-300" />
                      <span className="font-medium">Optimized for daily staff use</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Quick access to attendance, fee records, and reminders in a compact mobile flow.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-white/10 dark:bg-black/20">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <ShieldCheck size={16} className="text-teal-500 dark:text-teal-300" />
                      <span className="font-medium">Direct distribution</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Install the signed APK directly from your organization without waiting on store approval cycles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7 dark:border-white/10 dark:bg-[#0b101b] dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Install Guide</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Set up in under two minutes</h2>
            <div className="mt-6 grid gap-3">
              {installSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-400 text-sm font-semibold text-slate-900">
                      {index + 1}
                    </span>
                    <p className="font-medium text-slate-900 dark:text-white">{step.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5 dark:border-white/10 dark:bg-[#0b101b] dark:shadow-none">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">What&apos;s Included</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Current release notes</h2>
            <div className="mt-5 space-y-3">
              {releaseNotes.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-black/20 dark:text-slate-300"
                >
                  <CheckCircle2 size={18} className="mt-0.5 text-teal-500 dark:text-teal-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs leading-5 text-slate-500 dark:border-white/15 dark:bg-black/20 dark:text-slate-400">
              If Android blocks the install, open your browser download prompt and temporarily allow installs from that source, then retry the APK.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
