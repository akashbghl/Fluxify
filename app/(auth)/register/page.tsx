"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
} from "lucide-react";

/* ======================================================
    Animated Register Page
====================================================== */

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

  /* ============================
      Entrance Animation
  ============================ */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ============================
      Change handler
  ============================ */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ============================
      Register handler
  ============================ */

  const handleRegister = async (
    e: React.FormEvent
  ) => {
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
        throw new Error(
          data.message || "Registration failed"
        );
      }

      router.push("/login");
    } catch (err: any) {
      setError(
        err.message || "Something went wrong"
      );

      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
      UI
  ====================================================== */

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* Floating Blobs */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-300 opacity-30 blur-3xl animate-pulse" />
      <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-indigo-300 opacity-30 blur-3xl animate-pulse delay-1000" />

      {/* Back button  */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 py-1 px-4 border border-white/40 rounded-full text-white cursor-pointer hover:text-white transition"
      >
        ← Back
      </button>

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md text-white rounded-2xl border border-white/40  p-8 shadow-xl backdrop-blur-xl transition-all duration-700
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        ${shake ? "animate-shake" : ""}`}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2 cursor-pointer"
        onClick={()=> router.push('/')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-black font-bold">
            F
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            FluxiFy
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-semibold">
          Create your account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Start managing your workspace in minutes
        </p>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="mt-6 space-y-5"
        >
          {/* Name */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 "
            />

            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-10 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Orgnization Name */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <input
              name="organizationName"
              placeholder="Organization Name"
              value={form.organizationName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-10 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition focus:border-white border-gray-300 focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-10 py-2.5 text-sm outline-none transition focus:border-white focus:ring-2 focus:ring-black/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPass(!showPass)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPass ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Role */}
          <div className="relative ">
            <ShieldCheck
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white text-black px-10 py-2.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            >
              <option value="MANAGER">
                Manager
              </option>
              <option value="STAFF">
                Staff
              </option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Button */}
          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-medium text-white hover:underline"
            >
              Login
            </button>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Secure registration · Encrypted storage · Privacy
          protected
        </p>
      </div>

      {/* Shake Animation */}
      <style jsx>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
