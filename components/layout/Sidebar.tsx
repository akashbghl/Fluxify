"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  SofaIcon,
  CreditCard,
  CalendarCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Verified,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

/* ======================================================
   NAV CONFIG
====================================================== */

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: CalendarCheck,
  },
  {
    label: "Seat Chart",
    href: "/dashboard/seatchart",
    icon: SofaIcon,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

/* ======================================================
   SIDEBAR
====================================================== */


export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);



  useEffect(() => {
    const width = collapsed ? "5rem" : "16rem";
    document.documentElement.style.setProperty(
      "--sidebar-width",
      width
    );

    return () => {
      document.documentElement.style.setProperty(
        "--sidebar-width",
        "16rem"
      );
    };
  }, [collapsed]);

  const isItemActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-30 hidden h-screen flex-col border-r border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-white shadow-[0_10px_40px_-30px_rgba(15,23,42,0.35)] transition-all duration-300 md:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="relative flex h-20 items-center gap-3 border-b border-slate-200/80 px-4">

          {user?.organizationLogo ? (
            <img
              src={user.organizationLogo}
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
              alt="Organization Logo"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
              {user?.organizationName?.[0]?.toUpperCase() || "O"}
            </div>
          )}


          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                  {user?.organizationName || "Organization"}
                </p>

                {user?.organizationSubscription === "PRO" && user?.subscriptionStatus === "ACTIVE" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                    PRO
                    <Verified size={12} className="text-white" />
                  </span>
                )}
              </div>

              <p className="mt-1 text-[11px] font-semibold tracking-[0.12em] text-slate-500">
                WORKSPACE
              </p>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-300 bg-white p-1 shadow-sm transition hover:bg-slate-100"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>


        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1.5 p-3">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  collapsed ? "justify-center gap-0" : "gap-3",
                  active
                    ? "text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Active Indicator */}
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700"
                  />
                )}

                <span
                  className={clsx(
                    "relative z-10 rounded-lg p-1.5 transition",
                    active ? "bg-white/10" : "bg-slate-200/60 group-hover:bg-slate-200"
                  )}
                >
                  <Icon size={18} />
                </span>

                {!collapsed && (
                  <span className="relative z-10">
                    {item.label}
                  </span>
                )}

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full z-50 ml-3 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200/80 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside >

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden" >
        <div className="mx-auto flex w-full max-w-lg items-center justify-around gap-1 px-1">
        {
          navItems.map((item) => {
            const active = isItemActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-w-[56px] flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1 text-[10px] font-medium transition",
                  active
                    ? "text-slate-900"
                    : "text-slate-500"
                )}
              >
                <div
                  className={clsx(
                    "rounded-full p-2 transition",
                    active && "bg-slate-900 text-white shadow-sm"
                  )}
                >
                  <Icon size={18} />
                </div>
                <span className="max-w-[60px] truncate">
                  {item.label}
                </span>
              </Link>
            );
          })
        }
        </div>
      </nav>
    </>
  );
}
