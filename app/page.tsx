"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Shield,
  Bell,
  BarChart3,
  Users,
  CreditCard,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { StickyBanner } from "@/components/layout/StickyBanner";
import FloatingLines from "@/components/FloatingLines";
import Mnavbar from "@/components/Mnavbar";
import { Badge, FAQItem, FeatureCard, PricingCard, PrimaryButton, SecondaryButton, SectionHeader, Stat, StepCard, Testimonial } from "@/components/ReusableComponentsFunctions";
import BlurredCircle from "@/components/ui/BlurredCircle";

/* =====================================================
   MAIN PAGE
===================================================== */

export default function HomePage() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  return (
    <div className="relative min-h-screen bg-black text-gray-900">
      {/* Promo Banner */}
      {visible && (
        <StickyBanner
          isVisible={visible}
          onClose={() => setVisible(false)}
          className="bg-gradient-to-r from-black/99 via-violet-950 to-black/99 text-white text-sm"
        >
          🎉 Flat 50% OFF — Use code <b className="mx-2">FLUX50</b> today!
        </StickyBanner>
      )}


      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="relative min-h-screen bg-black" >
        <div className="absolute inset-0 z-0">
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={5}
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.7}
            interactive={true}
            parallax={true}
          />
        </div>
        {/* NAVBAR  */}
        <div className="relative z-20">
          <Mnavbar />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 text-center pointer-events-none">
          <Badge>All-in-one Library Management Platform</Badge>

          <h1 className="mt-6 text-4xl font-extrabold font-sans text-white leading-tight sm:text-5xl lg:text-6xl pointer-events-auto">
            Manage Your Library
            <span className="block text-white">
              Smarter, Faster, Better
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 font-cambria">
            Automate student management, fee tracking, attendance,
            reminders and analytics — all in one modern dashboard.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 pointer-events-auto">
            <PrimaryButton onClick={() => router.push("/register")}>
              Start Free Trial <ArrowRight size={16} />
            </PrimaryButton>

            <SecondaryButton onClick={() => router.push("/login")}>
              View Demo
            </SecondaryButton>
          </div>

          {/* Mock Preview */}
          <div className="relative mt-16 overflow-hidden rounded-xl border border-gray-100/20 shadow-xl">
            <div className="h-90 w-full bg-linear-to-b rounded-xl from-gray-200/10 to-gray-100/10 flex items-center justify-center text-gray-300">
              Dashboard Preview Placeholder
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="text-white">
        <BlurredCircle classname="-left-20 top-0" />
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-16 sm:grid-cols-4">
          <Stat value={5000} label="Active Students" />
          <Stat value={120} label="Libraries" />
          <Stat value={99.9} label="Uptime" />
          <Stat value={24} label="Support" />
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section id="features" className="py-24">
        <BlurredCircle classname="left-auto top-70" />
        <SectionHeader
          title="Powerful Features"
          subtitle="Everything you need to run your library efficiently."
        />

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Shield />}
            title="Secure Authentication"
            desc="Role-based access control with encrypted sessions and middleware protection."
          />

          <FeatureCard
            icon={<Bell />}
            title="Smart Notifications"
            desc="Automatic reminders for subscription expiry and pending payments."
          />

          <FeatureCard
            icon={<BarChart3 />}
            title="Analytics Dashboard"
            desc="Track revenue, attendance and business growth in real time."
          />

          <FeatureCard
            icon={<Users />}
            title="Student Management"
            desc="Create, update and manage students effortlessly."
          />

          <FeatureCard
            icon={<CreditCard />}
            title="Payment Tracking"
            desc="Record payments, generate reports and export CSV."
          />

          <FeatureCard
            icon={<Clock />}
            title="Attendance Monitoring"
            desc="Track daily attendance with check-in and check-out."
          />
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
          ===================================================== */}
      <section id="how" className="border-t border-gray-600/30 pt-16 text-white">
        <div className="mx-auto max-w-7xl px-6">

          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Launch your digital library system in three simple steps.
              No technical expertise required.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 border border-gray-700/30 divide-y md:divide-y-0 md:divide-x divide-gray-700/30">

            {/* Step 1 */}
            <div className="p-10">
              <div className="text-sm font-semibold text-violet-400">STEP 01</div>
              <h3 className="mt-4 text-2xl font-semibold">
                Create Your Account
              </h3>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                Sign up in seconds and set up your institution profile.
                Customize library rules, working hours, and categories
                to match your workflow.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-10">
              <div className="text-sm font-semibold text-violet-400">STEP 02</div>
              <h3 className="mt-4 text-2xl font-semibold">
                Add Students & Books
              </h3>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                Import students, register books, and configure
                subscriptions. Everything is centralized in a
                clean and intuitive dashboard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-10">
              <div className="text-sm font-semibold text-violet-400">STEP 03</div>
              <h3 className="mt-4 text-2xl font-semibold">
                Track, Automate & Grow
              </h3>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                Monitor borrowing activity, automate reminders,
                manage fines, and gain insights through advanced
                analytics to scale efficiently.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
          ===================================================== */}
      <section className="py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">

          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Loved by Managers
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Trusted by growing institutions to simplify operations and scale efficiently.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 border border-gray-700/30 divide-y md:divide-y-0 md:divide-x divide-gray-700/30">

            {/* Testimonial 1 */}
            <div className="p-10">
              <div className="text-sm text-gray-500">Library Owner</div>
              <h3 className="mt-2 text-xl font-semibold">Amit Sharma</h3>

              <p className="mt-6 text-gray-400 text-sm leading-relaxed">
                “Fluxify reduced my administrative workload by nearly 70%.
                Student management, reminders, and fine tracking are fully automated.
                It feels like having an extra staff member.”
              </p>

              <div className="mt-6 text-xs text-gray-600">
                Managing 1,200+ students
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-10">
              <div className="text-sm text-gray-500">Library Manager</div>
              <h3 className="mt-2 text-xl font-semibold">Neha Gupta</h3>

              <p className="mt-6 text-gray-400 text-sm leading-relaxed">
                “The analytics dashboard gives me real-time visibility
                into borrowing trends and overdue patterns.
                Decision-making is faster and more data-driven.”
              </p>

              <div className="mt-6 text-xs text-gray-600">
                3 Branch Locations
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-10">
              <div className="text-sm text-gray-500">Founder</div>
              <h3 className="mt-2 text-xl font-semibold">Rahul Verma</h3>

              <p className="mt-6 text-gray-400 text-sm leading-relaxed">
                “Clean interface, lightning-fast performance,
                and outstanding customer support.
                Implementation was seamless across our entire institution.”
              </p>

              <div className="mt-6 text-xs text-gray-600">
                5,000+ active members
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          PRICING
          ===================================================== */}
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

              <button className="cursor-pointer mt-8 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
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

      {/* =====================================================
          FAQ
      ===================================================== */}
      <section id="faq" className=" py-24">
        <BlurredCircle classname="left-auto top-50" />
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Quick answers for you."
        />

        <div className="mx-auto max-w-4xl px-6 space-y-4">
          <FAQItem
            q="Is my data secure?"
            a="Yes. We use encrypted cookies and secure authentication."
          />
          <FAQItem
            q="Can I export reports?"
            a="Yes. You can export CSV reports anytime."
          />
          <FAQItem
            q="Do you provide support?"
            a="Yes. Email and WhatsApp support are available."
          />
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="relative overflow-hidden rounded-xl border border-gray-300/20 w-7xl m-auto bg-gray-700/10 mb-10 py-4 text-white">
        <div className="relative mx-auto max-w-5xl px-6 text-center">

          {/* Small Badge */}
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm text-gray-300 backdrop-blur">
            🚀 Trusted by 10,000+ readers
          </span>

          {/* Headline */}
          <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Transform the way you manage your library
          </h2>

          {/* Subheading */}
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Organize books, track borrowers, and gain powerful insights —
            all in one modern, easy-to-use platform built for growing libraries.
          </p>

          {/* Feature Highlights */}
          <div className="mt-5 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✔</span> No credit card required
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✔</span> Setup in under 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✔</span> Cancel anytime
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/register")}
              className="rounded-xl cursor-pointer bg-gradient-to-r from-violet-500 to-pink-500 px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              Start Free Trial
            </button>

            <button
              onClick={() => router.push("/demo")}
              className="rounded-xl border border-white/20 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Book a Demo
            </button>
          </div>

          {/* Trust Note */}
          <p className="mt-8 text-xs text-gray-500">
            14-day free trial · No hidden fees · Secure & encrypted
          </p>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-gray-300/20 py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Fluxify | All rights reserved.
      </footer>
    </div>
  );
}


