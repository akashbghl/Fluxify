"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import FloatingLines from "@/components/FloatingLines";

/* ======================================================
    Animated Login Page
====================================================== */

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

  /* ============================
      Entrance Animation
  ============================ */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ============================
      Auto redirect
  ============================ */

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user]);

  /* ============================
      Login handler
  ============================ */

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
        throw new Error(
          data.message || "Invalid credentials"
        );
      }
      router.push("/dashboard");


    } catch (err: any) {
      setError(
        err.message || "Unable to login. Try again."
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

      {/* Floating Background Blobs */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-300 opacity-30 blur-3xl animate-pulse" />
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
        className={`relative z-10 w-full max-w-md rounded-2xl border border-white/40 p-8 shadow-xl backdrop-blur-xl transition-all duration-700
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        ${shake ? "animate-shake" : ""}`}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-black font-bold">
            F
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Fluxify
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-semibold text-white">
          Welcome Back
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Login to continue to your dashboard
        </p>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-5"
        >
          {/* Email */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-10 py-2.5 text-white text-sm outline-none transition focus:border-white focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
            />

            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full rounded-lg text-white border border-gray-300 px-10 py-2.5 text-sm outline-none transition focus:border-white focus:ring-2 focus:ring-black/10"
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

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {/* Button */}
          <Button
            type="submit"
            loading={loading}
            disabled={!email || !password}
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                Signing in...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">
              OR
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Register */}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="w-full rounded-md border px-3 py-2 text-sm font-medium text-white hover:text-black hover:bg-gray-100 transition"
          >
            Create new account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Secure login · Encrypted sessions · Privacy
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
