"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Check, Sparkles } from "lucide-react";
import BlurredCircle from "../ui/BlurredCircle";

const Pricing = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleButtonClick = () => {
    if (!user) {
      toast.error("Please log in to upgrade your subscription.");
      router.push("/login");
      return;
    }
    router.push("/dashboard/Subscription");
  };

  return (
    <section id="pricing" className="relative py-6">
      <BlurredCircle classname="-left-30 -top-50" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Find the perfect plan for your needs
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
            Start free, move to Pro when your operations expand, and use Enterprise for custom
            rollouts across branches.
          </p>
          <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-300">
            Save up to 20% on annual billing in dashboard checkout
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#0b101b] dark:shadow-none">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Starter</h3>
            <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">Free</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Ideal for early-stage centers starting digital operations.
            </p>
            <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {[
                "Up to 50 students",
                "Basic dashboard analytics",
                "Attendance and seat management",
                "Email support",
              ].map((item) => (
                <li className="flex items-start gap-2" key={item}>
                  <Check size={15} className="mt-0.5 text-emerald-600 dark:text-emerald-300" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={handleButtonClick}
              className="mt-8 cursor-pointer rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Get Started
            </button>
          </div>

          <div className="relative flex scale-[1.01] flex-col rounded-2xl border border-teal-300/60 bg-gradient-to-b from-teal-100 to-cyan-50 p-7 shadow-xl shadow-teal-200/60 lg:scale-[1.04] dark:border-teal-300/40 dark:from-teal-400/10 dark:via-cyan-400/5 dark:to-transparent dark:shadow-teal-900/15">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-teal-300/60 bg-teal-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-700 dark:border-teal-200/30 dark:bg-teal-400/20 dark:text-teal-100">
              Most Popular
            </span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pro</h3>
            <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">
              &#8377;149 <span className="text-base font-medium text-slate-600 dark:text-slate-300">/month</span>
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Built for high-volume centers with advanced operational needs.
            </p>
            <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-800 dark:text-slate-200">
              {[
                "Unlimited students",
                "Multi-shift enrollment and overlap rules",
                "Advanced analytics and reports",
                "Smart notifications and reminders",
                "Priority support",
              ].map((item) => (
                <li className="flex items-start gap-2" key={item}>
                  <Check size={15} className="mt-0.5 text-emerald-600 dark:text-emerald-300" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={handleButtonClick}
              className="mt-8 cursor-pointer rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 dark:bg-teal-400 dark:text-slate-900 dark:hover:bg-teal-300"
            >
              Upgrade to Pro
            </button>
          </div>

          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#0b101b] dark:shadow-none">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Enterprise</h3>
            <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">Custom</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Tailored implementation for multi-branch and large teams.
            </p>
            <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {[
                "Custom integrations",
                "Dedicated onboarding specialist",
                "Staff training and rollout support",
                "SLA-backed support",
              ].map((item) => (
                <li className="flex items-start gap-2" key={item}>
                  <Check size={15} className="mt-0.5 text-emerald-600 dark:text-emerald-300" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={handleButtonClick}
              className="mt-8 cursor-pointer rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
