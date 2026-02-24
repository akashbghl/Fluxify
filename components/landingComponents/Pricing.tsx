import React from 'react'
import BlurredCircle from '../ui/BlurredCircle'
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

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
    }

    return (
        <div>
            <section id="pricing" className="">
                <BlurredCircle classname="-left-20 -top-30" />
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

                        {/* Billing Hint */}
                        <p className="mt-3 text-sm text-violet-600 font-medium">
                            Save 20% with annual billing
                        </p>
                    </div>

                    {/* Pricing Grid */}
                    <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-3">

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
                                Get Started Free
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
                                ₹999 <span className="text-base font-medium text-gray-500">/month</span>
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
                                onClick={handleButtonClick}
                                className="cursor-pointer mt-8 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
                                Upgrade to Pro
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
        </div>
    )
}

export default Pricing
