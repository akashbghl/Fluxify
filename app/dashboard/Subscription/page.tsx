"use client";
import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import BlurredCircle from '@/components/ui/BlurredCircle';
const page = () => {
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

            const razorpay = new (window as any).Razorpay(options);
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
            <div className=" bg-[#0B0F19] text-white px-6 py-16">
                <div className="max-w-6xl mx-auto">

                    <section id="pricing" className="">
                        <BlurredCircle classname="-left-20 -top-30" />
                        <BlurredCircle classname="left-auto top-120" />
                        <div className="mx-auto max-w-7xl px-6">

                            {/* Header */}
                            <div className="mx-auto max-w-3xl text-center">
                                <h2 className="text-4xl font-bold tracking-tight font-arial text-white sm:text-4xl">
                                    Find the <span className="text-pink-400/70">Perfect Plan</span> for Your Needs
                                </h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Flexible plans designed for libraries and growing institutions.
                                    Start free and upgrade when you’re ready.
                                </p>

                                {/* Billing Toggle */}
                                <div className="mt-8 flex justify-center">
                                    <div className="bg-[#141A2A] p-1 rounded-lg flex">
                                        <button
                                            onClick={() => setBilling("monthly")}
                                            className={`px-6 py-2 text-sm rounded-md transition ${billing === "monthly"
                                                ? "bg-violet-600 text-white"
                                                : "text-gray-400"
                                                }`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            onClick={() => setBilling("annual")}
                                            className={`px-6 py-2 text-sm rounded-md transition ${billing === "annual"
                                                ? "bg-violet-600 text-white"
                                                : "text-gray-400"
                                                }`}
                                        >
                                            Annual (Save 20%)
                                        </button>
                                    </div>
                                </div>

                                {/* Billing Hint */}
                                <p className="mt-3 text-sm text-violet-600 font-medium">
                                    Save 20% with annual billing
                                </p>
                            </div>

                            {/* Pricing Grid */}
                            <div className="mt-10 grid grid-cols-1 max-md:gap-8 gap-2 md:grid-cols-3">

                                {/* Starter Plan */}
                                <div className="flex flex-col border border-gray-700/80 p-8 shadow-sm transition hover:shadow-md">
                                    <h3 className="text-lg font-semibold text-white">Starter</h3>
                                    <p className="mt-4 text-4xl font-bold text-gray-300">Free</p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Perfect for small libraries getting started.
                                    </p>

                                    <ul className="mt-8 space-y-4 text-sm text-gray-600 flex-1">
                                        <li>✔ Up to 50 students</li>
                                        <li>✔ Basic analytics dashboard</li>
                                        <li>✔ Issue & return tracking</li>
                                        <li>✔ Email support</li>
                                    </ul>

                                    <button className="cursor-pointer mt-8 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                                        {user?.organizationSubscription === "FREE" ? "Current Plan" : "Get Started Free"}
                                    </button>
                                </div>

                                {/* Pro Plan (Highlighted) */}
                                <div className="relative flex flex-col  border-2 border-violet-600/60 p-8 shadow-lg scale-105">

                                    {/* Badge */}
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold text-white">
                                        Most Popular
                                    </span>

                                    <h3 className="text-lg font-semibold text-white">Pro</h3>
                                    <p className="mt-4 text-4xl font-bold text-white">
                                        {billing === "monthly" ? (
                                            <>₹149 <span className="text-base font-medium text-gray-500">/month</span></>
                                        ) : (
                                            <>₹1499 <span className="text-base font-medium text-gray-500">/year</span></>
                                        )}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Best for growing institutions managing large collections.
                                    </p>

                                    <ul className="mt-8 space-y-4 text-sm text-gray-700 flex-1">
                                        <li>✔ Unlimited students</li>
                                        <li>✔ Advanced analytics & reports</li>
                                        <li>✔ WhatsApp reminders</li>
                                        <li>✔ Fine management system</li>
                                        <li>✔ Priority support</li>
                                    </ul>

                                    <button
                                        onClick={() => {
                                            if (!isProActive) {
                                                handlePayment();
                                            }
                                        }}
                                        disabled={isProActive}
                                        className={`mt-8 rounded-lg px-6 py-3 text-sm font-semibold text-white transition ${isProActive
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-violet-600 hover:bg-violet-700 cursor-pointer"
                                            }`}
                                    >
                                        {isProActive && user?.subscriptionExpiry
                                            ? `Already Purchased (valid till ${new Date(
                                                user.subscriptionExpiry
                                            ).toLocaleDateString()})`
                                            : "Upgrade to Pro"}
                                    </button>
                                </div>

                                {/* Enterprise Plan */}
                                <div className="flex flex-col border border-gray-700/80 p-8 shadow-sm transition hover:shadow-md">
                                    <h3 className="text-lg font-semibold text-white">Enterprise</h3>
                                    <p className="mt-4 text-4xl font-bold text-white">Custom</p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Tailored solutions for multi-branch institutions.
                                    </p>

                                    <ul className="mt-8 space-y-4 text-sm text-gray-600 flex-1">
                                        <li>✔ Custom integrations</li>
                                        <li>✔ Dedicated account manager</li>
                                        <li>✔ Staff onboarding & training</li>
                                        <li>✔ SLA & priority support</li>
                                    </ul>

                                    <button className="cursor-pointer mt-8 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:text-black hover:bg-gray-100">
                                        Contact Sales
                                    </button>
                                </div>

                            </div>

                        </div>
                    </section>

                    {/* Secure Note */}
                    <div className="mt-12 text-center text-xs text-gray-500">
                        Payments are securely processed via Razorpay.
                        You can cancel or change your plan anytime.
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    )
}

export default page
