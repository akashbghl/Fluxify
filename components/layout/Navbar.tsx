"use client";

import { Bell, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  read?: boolean;
}

export default function Navbar() {
  const { user, logout } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* ============================
      Fetch Notifications
  ============================ */

  useEffect(() => {
    fetch("/api/notifications", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Inject fake read flag for UX demo
          setNotifications(
            data.notifications.map((n: any, i: number) => ({
              ...n,
              read: i !== 0,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  /* ============================
      Outside Click
  ============================ */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          placeholder="Search students..."
          className="w-64 rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* 🔔 Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative rounded-full p-2 transition hover:bg-gray-100"
          >
            <Bell size={18} />

            {/* Badge */}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border border-gray-400 bg-white/10 z-99 shadow-xl backdrop-blur"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-400 px-4 py-3">
                  <p className="text-sm font-semibold">
                    Notifications
                  </p>
                  <span className="text-xs text-gray-500">
                    {unreadCount} unread
                  </span>
                </div>

                {/* Content */}
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-sm text-gray-500">
                    🎉 You're all caught up!
                  </div>
                ) : (
                  <ul className="max-h-96 overflow-y-auto scrollbar-thin">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`group relative flex gap-3 border-b px-4 py-3 text-sm transition last:border-none hover:bg-gray-50 ${
                          !n.read
                            ? "bg-indigo-50/40"
                            : ""
                        }`}
                      >
                        {/* Unread dot */}
                        {!n.read ? 
                          <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                          :
                          <div className="ml-2 "></div>
                        }

                        <div className="flex-1">
                          <p className="font-medium leading-tight">
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {n.message}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 👤 Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-md p-1 hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
              {user?.name?.[0] || "U"}
            </div>

            <div className="hidden text-left text-sm sm:block">
              <p className="font-medium leading-none">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute z-50 right-0 mt-2 w-48 rounded-xl border bg-white shadow-lg">
              <button
                onClick={() =>
                  (window.location.href =
                    "/dashboard/settings")
                }
                className="flex w-full items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100"
              >
                <User size={16} />
                Profile Settings
              </button>

              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm rounded-xl text-red-600 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
