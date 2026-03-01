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
  ArrowUpRight,
  Clock3,
  ShieldAlert,
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

interface MonthlyRevenueDatum {
  _id: {
    year: number;
    month: number;
  };
  total: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueDatum[]>(
    []
  );
  const [expiringSoon, setExpiringSoon] = useState<ExpiringStudent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/dashboard", {
        credentials: "include",
      });
      const data = await res.json();
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
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-rose-100 bg-white p-10 text-center shadow-sm">
          <div className="rounded-full bg-rose-100 p-3">
            <AlertTriangle className="text-rose-600" />
          </div>
          <p className="text-sm text-slate-600">{error}</p>
          <Button onClick={fetchDashboard}>Retry</Button>
        </div>
      </ProtectedRoute>
    );
  }

  if (!stats) return null;

  const attendanceRate =
    stats.activeStudents > 0
      ? Math.min(
          100,
          Math.round((stats.todayAttendance / stats.activeStudents) * 100)
        )
      : 0;

  const revenuePerStudent =
    stats.activeStudents > 0
      ? Math.round(stats.totalRevenue / stats.activeStudents)
      : 0;

  return (
    <ProtectedRoute>
      <div className="space-y-6 px-4 pb-20 pt-4 transition-all md:px-6 md:pb-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Dashboard Overview
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Real-time insights into your operations
              </p>
            </div>

            <Button
              variant="outline"
              onClick={fetchDashboard}
              className="flex items-center gap-2 border-slate-300 bg-white hover:bg-slate-100"
            >
              <RefreshCcw size={16} />
              Refresh
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <QuickInfoCard
              title="Attendance Health"
              value={`${attendanceRate}%`}
              icon={<Clock3 size={16} />}
              tone="emerald"
              subtitle={`${stats.todayAttendance} checked in today`}
            />
            <QuickInfoCard
              title="Revenue / Active Student"
              value={`INR ${revenuePerStudent}`}
              icon={<ArrowUpRight size={16} />}
              tone="blue"
              subtitle="Estimated this cycle"
            />
            <QuickInfoCard
              title="Renewal Risk"
              value={`${expiringSoon.length}`}
              icon={<ShieldAlert size={16} />}
              tone="amber"
              subtitle="Students expiring soon"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
            value={`INR ${stats.totalRevenue}`}
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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                Revenue Trends
              </h3>
              <span className="rounded-full bg-slate-100 p-2 text-slate-700">
                <TrendingUp size={18} />
              </span>
            </div>
            <RevenueChart data={monthlyRevenue} />
          </div>

          <div className="rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/70 to-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
              Expiring Soon
              <AlertTriangle size={16} className="text-amber-500" />
            </h3>

            {expiringSoon.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-sm text-slate-500">
                No upcoming expiries
              </div>
            ) : (
              <ul className="max-h-[340px] space-y-3 overflow-auto pr-1">
                {expiringSoon.map((s) => (
                  <li
                    key={s._id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-amber-200 hover:bg-amber-50/30"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {s.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {s.phone}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                        {new Date(s.expiryDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-500">
                        {Math.ceil(
                          (new Date(s.expiryDate).getTime() -
                            new Date().setHours(0, 0, 0, 0)) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days left
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

function QuickInfoCard({
  title,
  value,
  subtitle,
  icon,
  tone,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: "emerald" | "blue" | "amber";
}) {
  const toneClass = {
    emerald: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
    blue: "border-blue-100 bg-blue-50/70 text-blue-700",
    amber: "border-amber-100 bg-amber-50/70 text-amber-700",
  }[tone];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
          {title}
        </p>
        <span className={`rounded-md border p-1.5 ${toneClass}`}>{icon}</span>
      </div>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600">{subtitle}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6 px-4 pb-20 pt-4 md:px-6 md:pb-6">
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-52 rounded bg-slate-200" />
          <div className="h-9 w-28 rounded bg-slate-200" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-200" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="h-80 rounded-2xl bg-slate-200 xl:col-span-2" />
        <div className="h-80 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
