"use client";

import { Bell, Search, User, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  read?: boolean;
}

interface NotificationApiItem {
  id?: string;
  _id?: string;
  title?: string;
  message?: string;
}

interface NotificationApiResponse {
  success?: boolean;
  notifications?: NotificationApiItem[];
}

export default function Navbar() {
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications", { credentials: "include" })
      .then(async (res) => {
        const data = (await res.json()) as NotificationApiResponse;
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(
            data.notifications.map((n, i) => ({
              id: n.id || n._id || `notif-${i}`,
              title: n.title || "Notification",
              message: n.message || "",
              read: i !== 0,
            }))
          );
        }
      })
      .catch(() => {
        setNotifications([]);
      });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    []
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-3 py-2 backdrop-blur sm:px-4 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 sm:inline-flex sm:items-center sm:gap-1.5">
            <Sparkles size={12} className="text-amber-500" />
            <span>{today}</span>
          </div>

          <div className="relative w-full max-w-[240px] sm:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students, payments, attendance..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="Open notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {unreadCount} unread
                    </span>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      You are all caught up.
                    </div>
                  ) : (
                    <ul className="max-h-96 overflow-y-auto scrollbar-thin">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className={`flex gap-3 border-b border-slate-100 px-4 py-3 text-sm transition last:border-none hover:bg-slate-50 ${
                            !n.read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="mt-1 w-3">
                            {!n.read && <span className="block h-2 w-2 rounded-full bg-blue-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium leading-tight text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-600">{n.message}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 pr-2 transition hover:bg-slate-100"
              aria-label="Open profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[120px] truncate text-sm font-medium leading-none text-slate-900">
                  {user?.name || "User"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{user?.role}</p>
              </div>
              <ChevronDown size={14} className="hidden text-slate-500 sm:block" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                  <button
                    onClick={() => {
                      window.location.href = "/dashboard/settings";
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <User size={16} />
                    Profile Settings
                  </button>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
