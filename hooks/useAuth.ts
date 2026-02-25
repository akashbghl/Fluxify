"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { s } from "framer-motion/client";

interface Organization {
    _id: string;
    name: string;
    slug: string;
    plan: "FREE" | "PRO" | "ENTERPRISE";
    isConfigured: boolean;
    seatConfig?: {
        totalSeats: number;
        shifts: {
            shiftName: string;
            totalSeats: number;
            startTime?: string;
            endTime?: string;
        }[];
    } | null;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "MANAGER" | "STAFF";
    organizationId: string;
    organizationName: string;
    organizationLogo: string;
    organizationSubscription: "FREE" | "PRO" | "ENTERPRISE" | null;
    subscriptionExpiry?: string; // ISO date string
    subscriptionStatus?: "ACTIVE" | "EXPIRED" | "CANCELLED" | null;
}

export function useAuth() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("/api/auth/me", {
                    credentials: "include",
                });

                const data = await res.json();
                console.log("Auth Me Response:", data);
                if (data.success) {
                    setUser(data.user);
                    setOrganization(data.organization);
                } else {
                    setUser(null);
                    setOrganization(null);
                }
            } catch {
                setUser(null);
                setOrganization(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);


    /* ============================
        Logout
    ============================ */

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // ignore network errors
        }
        setUser(null);
        setOrganization(null);

        // Hard redirect so middleware re-checks cookie
        window.location.href = "/";
    };

    const refreshUser = async () => {
        const res = await fetch("/api/auth/me", {
            credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
            setUser(data.user);
            setOrganization(data.organization);
        }
    };

    return {
        user,
        organization,
        loading,
        isAuthenticated: !!user,
        logout,
        refreshUser,
    };
}
