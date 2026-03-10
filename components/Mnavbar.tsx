"use client";

import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const Mnavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const navLinks = [
    { label: "Features", href: pathname === "/" ? "#features" : "/#features" },
    { label: "How it works", href: pathname === "/" ? "#how" : "/#how" },
    { label: "Pricing", href: pathname === "/" ? "#pricing" : "/#pricing" },
    { label: "Downloads", href: "/downloads" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur max-md:border-b border-slate-200/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-1">
          <img
            src={`${theme === "dark" ? "/NLogo.jpg" : "/NlogoWhite.webp"}`}
            alt="Fluxify Logo"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span
            className="cursor-pointer text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            onClick={() => router.push("/")}
          >
            Fluxify.io
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex dark:text-slate-200">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 max-md:gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="cursor-pointer rounded-full bg-white p-2 text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-white/10"
          >
            <span
              className={`block transform-gpu transition-transform duration-500 ${theme === "dark" ? "rotate-0" : "rotate-180"
                }`}
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </span>
          </button>

          {user ? (
            <button onClick={() => router.push("/dashboard")}
              className="ml-4 cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-teal-400 dark:text-slate-900 dark:hover:bg-teal-300"
            >Go to Dashboard</button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/login")}
                className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-slate-700 max-md:bg-teal-400/20 transition hover:bg-slate-100 hover:text-slate-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                Sign in
              </button>

              <button
                onClick={() => router.push("/register")}
                className="hidden md:flex cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-teal-400 dark:text-slate-900 dark:hover:bg-teal-300"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Mnavbar;
