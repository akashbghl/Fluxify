"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
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
    icon: CalendarCheck,
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
  console.log(user);



  useEffect(() => {
    const width = collapsed ? "5rem" : "16rem";
    document.documentElement.style.setProperty(
      "--sidebar-width",
      width
    );
  }, [collapsed]);

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-30 hidden h-screen flex-col border-r bg-white transition-all duration-300 md:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="relative flex h-16 items-center gap-3 border-b px-4">

          {user?.organizationLogo ? (
            <img
              src={user.organizationLogo}
              className="h-9 w-9 rounded-md object-cover"
              alt="Organization Logo"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-tr-md rounded-bl-md bg-black text-sm font-semibold text-white">
              {user?.organizationName?.[0]?.toUpperCase() || "O"}
            </div>
          )}


          {!collapsed && (
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                  {user?.organizationName || "Organization"}
                </p>

                {user?.organizationSubscription === "PRO" && user?.subscriptionStatus === "ACTIVE" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                    PRO
                    <Verified size={12} className="text-white" />
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs font-medium text-gray-500 tracking-wide">
                WORKSPACE
              </p>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border bg-white p-1 shadow hover:bg-gray-50"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>


        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {/* Active Indicator */}
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-black"
                  />
                )}

                <span className="relative z-10">
                  <Icon size={18} />
                </span>

                {!collapsed && (
                  <span className="relative z-10">
                    {item.label}
                  </span>
                )}

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-3 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 shadow transition group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside >

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-white py-2 md:hidden" >
        {
          navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center gap-1 px-3 py-1 text-xs transition",
                  active
                    ? "text-black"
                    : "text-gray-400"
                )}
              >
                <div
                  className={clsx(
                    "rounded-full p-2 transition",
                    active && "bg-black text-white"
                  )}
                >
                  <Icon size={18} />
                </div>
                {item.label}
              </Link>
            );
          })
        }
      </nav>
    </>
  );
}
