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
      <BlurredCircle classname="-left-20 -top-30" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            choose plan according to your needs
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
            Start free, move to Pro when your operations expand, and use Enterprise for custom
            rollouts across branches.
          </p>
          <p className="mt-3 text-sm font-medium text-emerald-300">
            Save up to 20% on annual billing in the dashboard checkout flow
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0b101b] p-7">
            <h3 className="text-lg font-semibold text-white">Starter</h3>
            <p className="mt-4 text-4xl font-semibold text-slate-100">Free</p>
            <p className="mt-2 text-sm text-slate-400">
              Ideal for early-stage centers starting digital operations.
            </p>

            <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Up to 50 students
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Basic dashboard analytics
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Attendance and seat management
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Email support
              </li>
            </ul>

            <button
              onClick={handleButtonClick}
              className="mt-8 cursor-pointer rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Get Started
            </button>
          </div>

          <div className="relative flex scale-[1.01] flex-col rounded-2xl border border-teal-300/40 bg-gradient-to-b from-teal-400/10 via-cyan-400/5 to-transparent p-7 shadow-xl shadow-teal-900/15 lg:scale-[1.04]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-teal-200/30 bg-teal-400/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-100">
              Most Popular
            </span>

            <h3 className="text-lg font-semibold text-white">Pro</h3>
            <p className="mt-4 text-4xl font-semibold text-white">
              &#8377;149 <span className="text-base font-medium text-slate-300">/month</span>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Built for high-volume centers with advanced operational needs.
            </p>

            <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Unlimited students
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Multi-shift enrollment and overlap rules
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Advanced analytics and reports
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Smart notifications and reminders
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Priority support
              </li>
            </ul>

            <button
              onClick={handleButtonClick}
              className="mt-8 cursor-pointer rounded-xl bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-300"
            >
              Upgrade to Pro
            </button>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0b101b] p-7">
            <h3 className="text-lg font-semibold text-white">Enterprise</h3>
            <p className="mt-4 text-4xl font-semibold text-white">Custom</p>
            <p className="mt-2 text-sm text-slate-400">
              Tailored implementation for multi-branch and large teams.
            </p>

            <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Custom integrations
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Dedicated onboarding specialist
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                Staff training and rollout support
              </li>
              <li className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 text-emerald-300" />
                SLA-backed support
              </li>
            </ul>

            <button
              onClick={handleButtonClick}
              className="mt-8 cursor-pointer rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
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
