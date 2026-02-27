"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  const { user, refreshUser, loading } = useAuth();
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("Activating your subscription...");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // If subscription already active, redirect immediately
    if (user?.subscriptionStatus === "ACTIVE") {
      router.push("/dashboard");
      return;
    }

    // Poll user data until subscription is active
    const interval = setInterval(async () => {
      setAttempts((prev) => prev + 1);

      try {
        await refreshUser();

        if (user?.subscriptionStatus === "ACTIVE") {
          clearInterval(interval);
          router.push("/dashboard");
        } else if (attempts >= 15) {
          clearInterval(interval);
          setStatusMessage(
            "Payment processed. If your subscription is not active yet, please contact support."
          );
        }
      } catch (err) {
        console.error("Error refreshing user:", err);
        clearInterval(interval);
        setStatusMessage("Something went wrong. Please try again or contact support.");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [user, attempts, refreshUser, router, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-gray-800 rounded-xl shadow-xl p-8 text-center"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-500 rounded-full p-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">Payment Successful 🎉</h1>
        <p className="text-gray-300 mb-6">{statusMessage}</p>

        {/* Progress bar / animation */}
        {user?.subscriptionStatus !== "ACTIVE" && attempts < 15 && (
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
            <motion.div
              animate={{ width: ["0%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute top-0 left-0 h-2 bg-green-500"
            />
          </div>
        )}

        {/* Support / CTA */}
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Need help? Contact <a href="mailto:support@yourapp.com" className="underline">support</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}