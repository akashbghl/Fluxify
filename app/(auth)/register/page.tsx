"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, Building2 } from "lucide-react";

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
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const isEmailField = e.target.name === "email";
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (isEmailField) {
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    }
  };

  const handleSendOtp = async () => {
    if (sendingOtp) return;
    if (!form.email.trim()) {
      setError("Please enter email first");
      return;
    }

    setError("");
    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "send_register_otp",
          email: form.email,
          name: form.name,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setOtpSent(true);
      setOtpVerified(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send verification code");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (verifyingOtp) return;
    if (!form.email.trim() || !otp.trim()) {
      setError("Enter email and verification code");
      return;
    }

    setError("");
    setVerifyingOtp(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verify_register_otp",
          email: form.email,
          otp,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "OTP verification failed");
      }

      setOtpVerified(true);
    } catch (err: unknown) {
      setOtpVerified(false);
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      if (!otpVerified) {
        throw new Error("Please verify your email before creating account");
      }

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
        className="absolute left-4 top-6 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 sm:left-6 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
      >
        Back
      </button>

      <div
        className={`w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-2xl shadow-slate-200/80 backdrop-blur-xl transition-all duration-700 dark:border-white/15 dark:bg-[#0b101b]/90 dark:shadow-black/30 ${
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
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Fluxify</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white">Create account</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Set up your organization and start running operations in minutes.
            </p>

            <form onSubmit={handleRegister} className="mt-7 space-y-4">
              <div className="relative">
                <User
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                />
                <input
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400/70 focus:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-300/50 dark:focus:bg-white/10"
                />
              </div>

              <div className="relative">
                <Building2
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                />
                <input
                  name="organizationName"
                  placeholder="Organization name"
                  value={form.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400/70 focus:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-300/50 dark:focus:bg-white/10"
                />
              </div>

              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400/70 focus:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-300/50 dark:focus:bg-white/10"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !form.email.trim()}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  {sendingOtp ? "Sending..." : otpSent ? "Resend Code" : "Send Code"}
                </button>
                {otpVerified && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
                    Email verified
                  </span>
                )}
              </div>

              {otpSent && !otpVerified && (
                <div className="flex items-center gap-2">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter verification code"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400/70 focus:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-300/50 dark:focus:bg-white/10"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || !otp.trim()}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-500 dark:text-slate-900 dark:hover:bg-teal-400"
                  >
                    {verifyingOtp ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}

              <div className="relative">
                <Lock
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400/70 focus:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-300/50 dark:focus:bg-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400/70 focus:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-teal-300/50 dark:focus:bg-white/10"
                >
                  <option value="MANAGER" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    Manager
                  </option>
                  <option value="STAFF" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    Staff
                  </option>
                </select>
              </div>

              {error && (
                <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full" disabled={!otpVerified}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-medium text-teal-600 hover:underline dark:text-teal-300"
                >
                  Login
                </button>
              </p>
            </form>
          </div>

          <div className="hidden border-l border-slate-200 bg-gradient-to-b from-cyan-100 to-teal-100 p-10 dark:border-white/10 dark:from-cyan-400/10 dark:to-teal-400/5 lg:col-span-5 lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">New Workspace</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
              Set the foundation for smooth operations
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your organization setup unlocks seat configuration, shift rules, attendance tracking,
              and payment workflows in one dashboard.
            </p>
            <div className="mt-7 space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-black/20">
                <p className="font-medium text-slate-900 dark:text-white">Centralized records</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Student profile, plan, seat, and payment details stay connected.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-black/20">
                <p className="font-medium text-slate-900 dark:text-white">Conflict-safe seat assignment</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Overlap checks reduce manual errors during enrollment and edits.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-black/20">
                <p className="font-medium text-slate-900 dark:text-white">Renewal-ready lifecycle</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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
