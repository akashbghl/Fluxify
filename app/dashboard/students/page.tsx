"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import StudentCard, {
  Student,
} from "@/components/students/StudentCard";
import Button from "@/components/ui/Button";
import { normalizeStudentShiftNames } from "@/lib/studentShift";

type Plan = "1_MONTH" | "3_MONTH" | "6_MONTH" | "12_MONTH";
type PaymentMode = "CASH" | "UPI" | "CARD" | "NETBANKING";

interface RenewalForm {
  plan: Plan;
  amountPaid: number;
  paymentMode: PaymentMode;
  transactionId: string;
  remarks: string;
}

export default function StudentsPage() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "EXPIRED"
  >("ALL");
  const [renewTarget, setRenewTarget] = useState<Student | null>(null);
  const [renewing, setRenewing] = useState(false);
  const [renewForm, setRenewForm] = useState<RenewalForm>({
    plan: "1_MONTH",
    amountPaid: 0,
    paymentMode: "CASH",
    transactionId: "",
    remarks: "",
  });

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

  const openRenewModal = (student: Student) => {
    setRenewTarget(student);
    setRenewForm({
      plan: (student.plan as Plan) || "1_MONTH",
      amountPaid: 0,
      paymentMode: "CASH",
      transactionId: "",
      remarks: "",
    });
  };

  const closeRenewModal = () => {
    if (renewing) return;
    setRenewTarget(null);
  };

  const handleRenewStudent = async () => {
    if (!renewTarget) return;

    setRenewing(true);
    try {
      const res = await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: renewTarget._id,
          plan: renewForm.plan,
          amountPaid: Number(renewForm.amountPaid || 0),
          paymentMode: renewForm.paymentMode,
          transactionId:
            renewForm.paymentMode === "CASH"
              ? ""
              : renewForm.transactionId.trim(),
          remarks: renewForm.remarks.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Renewal failed");
      }

      setStudents((prev) =>
        prev.map((s) => (s._id === data.student._id ? data.student : s))
      );
      setRenewTarget(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Renewal failed");
    } finally {
      setRenewing(false);
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
                onRenew={openRenewModal}
              />
            ))}
          </div>
        )}
      </div>

      {renewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Renew Student</h2>
              <p className="text-sm text-gray-500">
                {renewTarget.name} - Seat {renewTarget.seatNumber}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Plan</label>
                <select
                  value={renewForm.plan}
                  onChange={(e) =>
                    setRenewForm((prev) => ({
                      ...prev,
                      plan: e.target.value as Plan,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="1_MONTH">1 Month</option>
                  <option value="3_MONTH">3 Months</option>
                  <option value="6_MONTH">6 Months</option>
                  <option value="12_MONTH">12 Months</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Amount Paid (optional)</label>
                <input
                  type="number"
                  min={0}
                  value={renewForm.amountPaid}
                  onChange={(e) =>
                    setRenewForm((prev) => ({
                      ...prev,
                      amountPaid: Number(e.target.value || 0),
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Payment Mode</label>
                <select
                  value={renewForm.paymentMode}
                  onChange={(e) =>
                    setRenewForm((prev) => ({
                      ...prev,
                      paymentMode: e.target.value as PaymentMode,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="NETBANKING">Net Banking</option>
                </select>
              </div>

              {renewForm.paymentMode !== "CASH" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Transaction ID</label>
                  <input
                    type="text"
                    value={renewForm.transactionId}
                    onChange={(e) =>
                      setRenewForm((prev) => ({
                        ...prev,
                        transactionId: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium">Remarks (optional)</label>
                <input
                  type="text"
                  value={renewForm.remarks}
                  onChange={(e) =>
                    setRenewForm((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={closeRenewModal} disabled={renewing}>
                Cancel
              </Button>
              <Button onClick={handleRenewStudent} loading={renewing}>
                Renew Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
