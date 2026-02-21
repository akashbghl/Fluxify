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
import { useEffect, useState } from "react";
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
      <section id="how" className="py-24">
        <BlurredCircle classname="-left-20 top-10" />
        <SectionHeader
          title="How It Works"
          subtitle="Get started in minutes."
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          <StepCard
            step="01"
            title="Create Account"
            desc="Sign up in seconds and create your workspace."
          />
          <StepCard
            step="02"
            title="Add Students"
            desc="Register students and configure subscriptions."
          />
          <StepCard
            step="03"
            title="Track & Grow"
            desc="Monitor analytics and automate reminders."
          />
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
          ===================================================== */}
      <section className="py-24">
        <BlurredCircle classname="left-auto top-50" />
        <SectionHeader
          title="Loved by Managers"
          subtitle="Trusted by growing institutions."
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
          <Testimonial
            name="Amit Sharma"
            role="Library Owner"
            text="Fluxify reduced my admin workload by 70%. Everything is automated."
          />
          <Testimonial
            name="Neha Gupta"
            role="Manager"
            text="The dashboard insights help me make faster decisions."
          />
          <Testimonial
            name="Rahul Verma"
            role="Founder"
            text="Clean UI, fast performance and great support."
          />
        </div>
      </section>

      {/* =====================================================
          PRICING
          ===================================================== */}
      <section id="pricing" className="py-24">
        <BlurredCircle classname="left-0 top-50" />
        <SectionHeader
          title="Simple Pricing"
          subtitle="Transparent plans for every size."
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
          <PricingCard
            title="Starter"
            price="Free"
            features={[
              "Up to 50 students",
              "Basic analytics",
              "Email support",
            ]}
          />

          <PricingCard
            highlighted
            title="Pro"
            price="₹999 / month"
            features={[
              "Unlimited students",
              "Advanced analytics",
              "WhatsApp reminders",
              "Priority support",
            ]}
          />

          <PricingCard
            title="Enterprise"
            price="Custom"
            features={[
              "Custom integrations",
              "Dedicated support",
              "Onboarding assistance",
            ]}
          />
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


