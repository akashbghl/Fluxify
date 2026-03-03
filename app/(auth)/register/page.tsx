"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, Building2, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MANAGER",
    organizationName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "register",
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <button
        onClick={() => router.push("/")}
        className="absolute left-4 top-6 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white transition hover:bg-white/10 sm:left-6"
      >
        Back
      </button>

      <div
        className={`w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-[#0b101b]/90 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-700 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        } ${shake ? "animate-shake" : ""}`}
      >
        <div className="grid lg:grid-cols-12">
          <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
            <div
              className="mb-8 inline-flex cursor-pointer items-center gap-2"
              onClick={() => router.push("/")}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-300 text-sm font-bold text-slate-900">
                F
              </div>
              <span className="text-lg font-semibold text-white">Fluxify</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Create account</h1>
            <p className="mt-2 text-sm text-slate-400">
              Set up your organization and start running operations in minutes.
            </p>

            <form onSubmit={handleRegister} className="mt-7 space-y-4">
              <div className="relative">
                <User
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-10 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/50 focus:bg-white/10"
                />
              </div>

              <div className="relative">
                <Building2
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="organizationName"
                  placeholder="Organization name"
                  value={form.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-10 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/50 focus:bg-white/10"
                />
              </div>

              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-10 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/50 focus:bg-white/10"
                />
              </div>

              <div className="relative">
                <Lock
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-10 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/50 focus:bg-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 px-10 py-3 text-sm text-white outline-none transition focus:border-teal-300/50 focus:bg-white/10"
                >
                  <option value="MANAGER" className="bg-slate-900 text-white">
                    Manager
                  </option>
                  <option value="STAFF" className="bg-slate-900 text-white">
                    Staff
                  </option>
                </select>
              </div>

              {error && (
                <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full">
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-medium text-teal-300 hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          </div>

          <div className="hidden border-l border-white/10 bg-gradient-to-b from-cyan-400/10 to-teal-400/5 p-10 lg:col-span-5 lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">New Workspace</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Set the foundation for smooth operations
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your organization setup unlocks seat configuration, shift rules, attendance tracking,
              and payment workflows in one dashboard.
            </p>
            <div className="mt-7 space-y-3 text-sm text-slate-200">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="font-medium text-white">Centralized records</p>
                <p className="mt-1 text-xs text-slate-400">
                  Student profile, plan, seat, and payment details stay connected.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="font-medium text-white">Conflict-safe seat assignment</p>
                <p className="mt-1 text-xs text-slate-400">
                  Overlap checks reduce manual errors during enrollment and edits.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="font-medium text-white">Renewal-ready lifecycle</p>
                <p className="mt-1 text-xs text-slate-400">
                  Extend subscriptions and track collections without losing history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-4px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
