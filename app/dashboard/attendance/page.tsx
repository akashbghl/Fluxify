"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Button from "@/components/ui/Button";

interface Student {
  _id: string;
  name: string;
}

interface Attendance {
  _id: string;
  student: Student;
  checkIn: string;
  checkOut?: string;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");

  /* ============================
      Fetch Data
  ============================ */

  const fetchData = async () => {
    try {
      const [attendanceRes, studentsRes] =
        await Promise.all([
          fetch("/api/attendance"),
          fetch("/api/students"),
        ]);

      const attendanceData =
        await attendanceRes.json();
      const studentsData = await studentsRes.json();

      if (attendanceData.success) {
        setRecords(attendanceData.records);
      }

      if (studentsData.success) {
        setStudents(studentsData.students);
      }
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const checkedInCount = useMemo(
    () => records.filter((r) => !r.checkOut).length,
    [records]
  );

  const checkedOutCount = useMemo(
    () => records.filter((r) => !!r.checkOut).length,
    [records]
  );

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((r) =>
      (r.student?.name || "").toLowerCase().includes(query)
    );
  }, [records, search]);

  const formatTime = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ============================
      Check In
  ============================ */

  const handleCheckIn = async () => {
    if (!studentId) return alert("Select student");

    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          source: "MANUAL",
        }),
      });

      fetchData();
    } catch {
      alert("Check-in failed");
    }
  };

  /* ============================
      Check Out
  ============================ */

  const handleCheckOut = async (id: string) => {
    try {
      await fetch("/api/attendance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceId: id,
        }),
      });

      fetchData();
    } catch {
      alert("Check-out failed");
    }
  };

  /* ============================
      UI
  ============================ */

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
              <p className="mt-1 text-sm text-slate-500">
                Mark check-ins/check-outs and monitor live attendance activity.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live Tracking
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total Records
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{records.length}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                Currently In Library
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-900">{checkedInCount}</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                Checked Out
              </p>
              <p className="mt-2 text-2xl font-semibold text-blue-900">{checkedOutCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Manual Check In</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-10 min-w-[220px] rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-500"
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <Button onClick={handleCheckIn}>Check In</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800">Attendance Records</p>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name"
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-500 sm:w-72"
            />
          </div>

          <div className="overflow-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Student</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Check In</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Check Out</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 font-medium text-slate-800">{r.student?.name || "-"}</td>
                    <td className="px-3 py-2.5 text-slate-700">{formatTime(r.checkIn)}</td>
                    <td className="px-3 py-2.5 text-slate-700">{formatTime(r.checkOut)}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${r.checkOut
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {r.checkOut ? "Checked Out" : "In Library"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {!r.checkOut ? (
                        <Button variant="outline" onClick={() => handleCheckOut(r._id)}>
                          Check Out
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
