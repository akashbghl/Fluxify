import { Check, ChevronDown, Star } from "lucide-react";
import { useEffect, useState } from "react";

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-gray-900/50 px-4 py-1 text-xs font-medium text-white">
      {children}
    </span>
  );
}

export function PrimaryButton({
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

export function SecondaryButton({
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

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-12 text-center text-white">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="mt-3 text-gray-600">{subtitle}</p>
    </div>
  );
}

export function FeatureCard({
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

export function StepCard({
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

export function Testimonial({
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

export function PricingCard({
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

export function FAQItem({ q, a }: { q: string; a: string }) {
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


export function Stat({ value, label }: { value: number; label: string }) {
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

