"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Shield,
  Bell,
  BarChart3,
  Check,
  Star,
  Sparkles,
  Users,
  CreditCard,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { StickyBanner } from "@/components/layout/StickyBanner";
import FloatingLines from "@/components/FloatingLines";
import Mnavbar from "@/components/Mnavbar";

/* =====================================================
   MAIN PAGE
===================================================== */

export default function HomePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedIn(true);
    }
  }, []);
  return (
    <div className="relative min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 text-gray-900">
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
      <section className="border-t border-gray-900">
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
      <section id="features" className="bg-gray-50 py-24">
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
      <section id="how" className="py-24 bg-white">
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
      <section className="bg-gray-50 py-24">
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
      <section id="pricing" className="py-24 bg-white">
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
      <section id="faq" className="bg-gray-50 py-24">
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
      <section className="bg-gradient-to-br from-gray-600 to-black py-24 text-white">
        <div className="mx-auto max-w-5xl text-center px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to transform your library?
          </h2>

          <p className="mt-4 text-gray-300">
            Start your free trial today. No credit card required.
          </p>

          <div className="mt-8">
            <button
              onClick={() => router.push("/register")}
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-200"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t bg-white py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Fluxify | All rights reserved.
      </footer>
    </div>
  );
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-gray-900/50 px-4 py-1 text-xs font-medium text-white">
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg cursor-pointer bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-gray-100/30 text-white cursor-pointer px-6 py-3 text-sm font-medium hover:bg-gray-100 bg-gray-100/10 transition"
    >
      {children}
    </button>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="mt-3 text-gray-600">{subtitle}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-3 text-black">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-gray-400">
        {step}
      </div>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Testimonial({
  name,
  role,
  text,
}: {
  name: string;
  role: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} />
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-600">
        “{text}”
      </p>
      <div className="mt-4 text-sm font-semibold">
        {name}
      </div>
      <div className="text-xs text-gray-500">{role}</div>
    </div>
  );
}

function PricingCard({
  title,
  price,
  features,
  highlighted,
}: {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${highlighted
        ? "border-black bg-gradient-to-br from-gray-600 to-black text-white"
        : "bg-white"
        }`}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-2xl font-bold">{price}</p>

      <ul className="mt-4 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <Check size={14} />
            {f}
          </li>
        ))}
      </ul>

      <button
        className={`mt-6 w-full rounded-md px-4 py-2 text-sm font-medium ${highlighted
          ? "bg-white text-black hover:bg-gray-200"
          : "border hover:bg-gray-100"
          }`}
      >
        Choose Plan
      </button>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-white p-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-medium"
      >
        {q}
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <p className="mt-3 text-sm text-gray-600">{a}</p>
      )}
    </div>
  );
}


function Stat({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <p className="text-3xl font-bold">{count}+</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

