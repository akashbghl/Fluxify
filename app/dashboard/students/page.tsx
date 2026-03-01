"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import StudentCard, {
  Student,
} from "@/components/students/StudentCard";
import Button from "@/components/ui/Button";
import { normalizeStudentShiftNames } from "@/lib/studentShift";

export default function StudentsPage() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "EXPIRED"
  >("ALL");

  /* ============================
      Fetch Students
  ============================ */

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setStudents(data.students);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ============================
      Filter Logic
  ============================ */

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = `
        ${s.name}
        ${s.phone}
        ${s.email || ""}
        ${normalizeStudentShiftNames({
          shiftName: s.shiftName,
          shiftNames: s.shiftNames,
        }).join(" ")}
        ${s.seatNumber || ""}
      `
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  /* ============================
      Delete Student
  ============================ */

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/students?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Optimistic update (no refetch needed)
      setStudents((prev) =>
        prev.filter((s) => s._id !== id)
      );

    } catch {
      alert("Delete failed");
    }
  };

  /* ============================
      Loading State
  ============================ */

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  /* ============================
      UI
  ============================ */

  return (
    <ProtectedRoute>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold">
            Students
          </h1>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* Search */}
            <input
              placeholder="Search name, phone, shift, seat..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black sm:w-64"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "ALL"
                    | "ACTIVE"
                    | "EXPIRED"
                )
              }
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>

            {/* Add Button */}
            <Button
              onClick={() =>
                router.push("/dashboard/students/add")
              }
            >
              Add Student
            </Button>
          </div>
        </div>

        {/* Grid */}
        {filteredStudents.length === 0 ? (
          <p className="text-sm text-gray-500">
            No students found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onEdit={() =>
                  router.push(
                    `/dashboard/students/${student._id}`
                  )
                }
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
