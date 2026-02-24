"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "MANAGER" | "STAFF";
    organizationId: string;
    organizationName: string;
    organizationLogo: string;
    organizationSubscription: "FREE" | "PRO" | "ENTERPRISE" | null;
}

export function useAuth() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    /* ============================
        Load user from localStorage
    ============================ */

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    /* ============================
        Login
    ============================ */

    const login = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

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

        localStorage.removeItem("user");
        setUser(null);

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
            localStorage.setItem("user", JSON.stringify(data.user));
        }
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
    };
}
