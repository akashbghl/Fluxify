"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
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
        credentials: "include",
        body: JSON.stringify({
          type: "login",
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to login. Try again.");
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
        className={`w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-[#0b101b]/90 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-700 ${
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

            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to manage students, seats, renewals, attendance, and payments.
            </p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {error && (
                <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} disabled={!email || !password} className="w-full">
                {loading ? "Signing in..." : "Login"}
              </Button>

              <button
                type="button"
                onClick={() => router.push("/register")}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Create new account
              </button>
            </form>

            <p className="mt-6 text-xs text-slate-500">
              Encrypted sessions | Role-based access | Private organization data
            </p>
          </div>

          <div className="hidden border-l border-white/10 bg-gradient-to-b from-teal-400/10 to-cyan-400/5 p-10 lg:col-span-5 lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-teal-200">Operator Console</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Control your daily desk flow</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Fluxify keeps admissions, seat control, attendance, and collection workflows in one
              workspace.
            </p>
            <div className="mt-7 space-y-3 text-sm text-slate-200">
              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 p-3">
                <ShieldCheck size={16} className="mt-0.5 text-teal-300" />
                <span>Organization-isolated data and protected APIs</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 p-3">
                <ShieldCheck size={16} className="mt-0.5 text-teal-300" />
                <span>Shift overlap checks to avoid seat booking conflicts</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 p-3">
                <ShieldCheck size={16} className="mt-0.5 text-teal-300" />
                <span>Unified alerts for renewals, payments, and attendance</span>
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
