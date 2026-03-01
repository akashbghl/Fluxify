"use client";
import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import BlurredCircle from '@/components/ui/BlurredCircle';

const Page = () => {
    const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
    const { user, refreshUser } = useAuth();
    const router = useRouter();

    const loadRazorpayScript = () => {
        return new Promise<boolean>((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            if (!user) {
                router.push("/login");
                toast.error("Please login to upgrade your plan");
                return;
            }

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Payment gateway failed to load.");
                return;
            }

            const response = await fetch("/api/razorpay/initiate-payment", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to initiate payment");
            }

            const order = await response.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: "Fluxify",
                description: "Pro Subscription",
                order_id: order.id,
                handler: function () {
                    router.push("/payment-success");
                },
                prefill: {
                    email: user.email,
                },
                modal: {
                    ondismiss: function () {
                        toast.info("Payment cancelled");
                    },
                },
                theme: {
                    color: "#7f22fe",
                },
            };

            const RazorpayCtor = (window as Window & {
                Razorpay: new (opts: unknown) => { open: () => void };
            }).Razorpay;
            const razorpay = new RazorpayCtor(options);
            razorpay.open();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const isProActive =
        (user?.organizationSubscription === "PRO" &&
            user.subscriptionStatus === "ACTIVE");

    return (
        <ProtectedRoute>
            <div className="relative overflow-hidden bg-[#090E19] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,0.14),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.2),transparent_35%),radial-gradient(circle_at_65%_75%,rgba(59,130,246,0.12),transparent_40%)]" />
                <div className="relative mx-auto max-w-6xl">
                    <section id="pricing">
                        <BlurredCircle classname="-left-20 -top-30" />
                        <BlurredCircle classname="left-auto top-120" />
                        <div className="mx-auto max-w-7xl">
                            <div className="mx-auto max-w-3xl text-center">
                                <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium tracking-wide text-slate-200">
                                    SUBSCRIPTION PLANS
                                </p>
                                <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                                    Find the <span className="text-indigo-300">Perfect Plan</span> for Your Needs
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                                    Flexible plans designed for libraries and growing institutions.
                                    Start free and upgrade when you are ready.
                                </p>

                                <div className="mt-8 flex justify-center">
                                    <div className="inline-flex rounded-xl border border-white/10 bg-slate-900/70 p-1 backdrop-blur">
                                        <button
                                            onClick={() => setBilling("monthly")}
                                            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${billing === "monthly"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-700/30"
                                                : "text-slate-300 hover:text-white"
                                                }`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            onClick={() => setBilling("annual")}
                                            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${billing === "annual"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-700/30"
                                                : "text-slate-300 hover:text-white"
                                                }`}
                                        >
                                            Annual (Save 20%)
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm font-medium text-emerald-300">
                                    Save 20% with annual billing
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
                                <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">
                                    <h3 className="text-lg font-semibold text-white">Starter</h3>
                                    <p className="mt-4 text-4xl font-bold text-slate-100">Free</p>
                                    <p className="mt-2 text-sm text-slate-300">
                                        Perfect for small libraries getting started.
                                    </p>

                                    <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-200">
                                        <li>&#10003; Up to 50 students</li>
                                        <li>&#10003; Basic analytics dashboard</li>
                                        <li>&#10003; Issue and return tracking</li>
                                        <li>&#10003; Email support</li>
                                    </ul>

                                    <button className="mt-8 cursor-pointer rounded-xl border border-white/10 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                        {user?.organizationSubscription === "FREE" ? "Current Plan" : "Get Started Free"}
                                    </button>
                                </div>

                                <div className="relative flex scale-[1.01] flex-col rounded-2xl border-2 border-indigo-400/60 bg-gradient-to-b from-indigo-500/10 to-blue-600/5 p-7 shadow-xl shadow-indigo-900/20 lg:scale-105">
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-indigo-800/40">
                                        Most Popular
                                    </span>

                                    <h3 className="text-lg font-semibold text-white">Pro</h3>
                                    <p className="mt-4 text-4xl font-bold text-white">
                                        {billing === "monthly" ? (
                                            <>&#8377;149 <span className="text-base font-medium text-slate-300">/month</span></>
                                        ) : (
                                            <>&#8377;1499 <span className="text-base font-medium text-slate-300">/year</span></>
                                        )}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-200">
                                        Best for growing institutions managing large collections.
                                    </p>

                                    <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-100">
                                        <li>&#10003; Unlimited students</li>
                                        <li>&#10003; Advanced analytics and reports</li>
                                        <li>&#10003; WhatsApp reminders</li>
                                        <li>&#10003; Fine management system</li>
                                        <li>&#10003; Priority support</li>
                                    </ul>

                                    <button
                                        onClick={() => {
                                            if (!isProActive) {
                                                handlePayment();
                                            }
                                        }}
                                        disabled={isProActive}
                                        className={`mt-8 rounded-xl px-6 py-3 text-sm font-semibold text-white transition ${isProActive
                                            ? "cursor-not-allowed bg-slate-500"
                                            : "cursor-pointer bg-indigo-500 shadow-lg shadow-indigo-800/40 hover:bg-indigo-400"
                                            }`}
                                    >
                                        {isProActive && user?.subscriptionExpiry
                                            ? `Already Purchased (valid till ${new Date(
                                                user.subscriptionExpiry
                                            ).toLocaleDateString()})`
                                            : "Upgrade to Pro"}
                                    </button>
                                </div>

                                <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">
                                    <h3 className="text-lg font-semibold text-white">Enterprise</h3>
                                    <p className="mt-4 text-4xl font-bold text-white">Custom</p>
                                    <p className="mt-2 text-sm text-slate-300">
                                        Tailored solutions for multi-branch institutions.
                                    </p>

                                    <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-200">
                                        <li>&#10003; Custom integrations</li>
                                        <li>&#10003; Dedicated account manager</li>
                                        <li>&#10003; Staff onboarding and training</li>
                                        <li>&#10003; SLA and priority support</li>
                                    </ul>

                                    <button className="mt-8 cursor-pointer rounded-xl border border-slate-300/40 px-6 py-3 text-sm font-semibold text-slate-100 transition-all hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900">
                                        Contact Sales
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mt-12 text-center text-xs text-slate-400">
                        Payments are securely processed via Razorpay.
                        You can cancel or change your plan anytime.
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default Page