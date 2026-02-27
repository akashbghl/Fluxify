"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
    const router = useRouter();

    useEffect(() => {
        let attempts = 0;

        const interval = setInterval(async () => {
            try {
                const res = await fetch("/api/me");
                const data = await res.json();

                if (data.subscriptionStatus === "ACTIVE") {
                    clearInterval(interval);
                    router.push("/dashboard");
                }

                attempts++;
                if (attempts >= 15) {
                    clearInterval(interval);
                }

            } catch (err) {
                console.error(err);
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Payment Successful 🎉
                </h1>
                <p className="text-gray-400">
                    Activating your subscription...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                    This may take a few seconds.
                </p>
            </div>
        </div>
    );
}