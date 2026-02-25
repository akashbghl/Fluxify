"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import RevenueChart from "@/components/charts/RevenueChart";
import Button from "@/components/ui/Button";
import {
  Users,
  UserCheck,
  UserX,
  IndianRupee,
  CalendarCheck,
  RefreshCcw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "@/components/ReusableComponentsFunctions";

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  expiredStudents: number;
  totalRevenue: number;
  todayAttendance: number;
}

interface ExpiringStudent {
  _id: string;
  name: string;
  phone: string;
  expiryDate: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(
    null
  );
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [expiringSoon, setExpiringSoon] = useState<
    ExpiringStudent[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================
      Fetch Dashboard
  ============================ */

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/dashboard", {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        throw new Error("Failed to load dashboard");
      }

      setStats(data.stats);
      setMonthlyRevenue(data.monthlyRevenue);
      setExpiringSoon(data.expiringSoon);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ============================
      UI States
  ============================ */

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardSkeleton />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-white p-10">
          <AlertTriangle className="text-red-500" />
          <p className="text-sm text-gray-600">
            {error}
          </p>
          <Button onClick={fetchDashboard}>
            Retry
          </Button>
        </div>
      </ProtectedRoute>
    );
  }

  if (!stats) return null;

  return (
    <ProtectedRoute>
      <div className="
      space-y-6 px-4 pb-20 pt-4 md:px-6 md:pb-6 transition-all">
        {/* ================= Header ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-500">
              Real-time insights into your operations
            </p>
          </div>

          <Button
            variant="outline"
            onClick={fetchDashboard}
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Refresh
          </Button>
        </div>

        {/* ================= Stats ================= */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<Users />}
            gradient="from-indigo-500 to-indigo-600"
          />

          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon={<UserCheck />}
            gradient="from-emerald-500 to-emerald-600"
          />

          <StatCard
            title="Expired"
            value={stats.expiredStudents}
            icon={<UserX />}
            gradient="from-rose-500 to-rose-600"
          />

          <StatCard
            title="Revenue"
            value={`₹${stats.totalRevenue}`}
            icon={<IndianRupee />}
            gradient="from-amber-500 to-amber-600"
          />

          <StatCard
            title="Today Attendance"
            value={stats.todayAttendance}
            icon={<CalendarCheck />}
            gradient="from-sky-500 to-sky-600"
          />
        </div>

        {/* ================= Content ================= */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Revenue */}
          <div className="lg:col-span-2 rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">
                Revenue Trends
              </h3>
              <TrendingUp size={18} />
            </div>
            <RevenueChart data={monthlyRevenue} />
          </div>

          {/* Expiring */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold flex items-center gap-2">
              Expiring Soon
              <AlertTriangle size={16} className="text-orange-500" />
            </h3>

            {expiringSoon.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-sm text-gray-500">
                🎉 No upcoming expiries
              </div>
            ) : (
              <ul className="space-y-3 max-h-[300px] overflow-auto pr-1">
                {expiringSoon.map((s) => (
                  <li
                    key={s._id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {s.phone}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                      {new Date(
                        s.expiryDate
                      ).toLocaleDateString()}
                    </span>
                      <span className="text-xs text-gray-500">
                      {/* days left   */}
                        {Math.ceil(
                          (new Date(s.expiryDate).getTime() -
                            new Date().setHours(0, 0, 0, 0)) /
                          (1000 * 60 * 60 * 24)
                        )} days left
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}



function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex justify-between">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-9 w-28 rounded bg-gray-200" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-gray-200"
          />
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="h-80 rounded-2xl bg-gray-200 xl:col-span-2" />
        <div className="h-80 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}
