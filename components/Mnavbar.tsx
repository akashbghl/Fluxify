"use client";

import { Moon, Sparkles, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const Mnavbar = () => {
  const router = useRouter();
  const [loggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("user"));
  });
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
          <a href="#features" className="transition hover:text-slate-900 dark:hover:text-white">
            Features
          </a>
          <a href="#how" className="transition hover:text-slate-900 dark:hover:text-white">
            How it works
          </a>
          <a href="#pricing" className="transition hover:text-slate-900 dark:hover:text-white">
            Pricing
          </a>
          <a href="#app" className="transition hover:text-slate-900 dark:hover:text-white">
            Downloads
          </a>
        </nav>

        <div className="flex items-center gap-1 max-md:gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="cursor-pointer rounded-full bg-white p-2 text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-white/10"
          >
            <span
              className={`block transform-gpu transition-transform duration-500 ${
                theme === "dark" ? "rotate-0" : "rotate-180"
              }`}
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </span>
          </button>

          {loggedIn ? (
            <PrimaryButton onClick={() => router.push("/dashboard")}>Go to Dashboard</PrimaryButton>
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

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
    >
      {children}
    </button>
  );
}

export default Mnavbar;
