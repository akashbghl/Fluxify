"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { IndianRupee, Plus, ReceiptText, Search, WalletCards } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  phone?: string;
  feesPaid?: number;
  pendingFees?: number;
}

interface Payment {
  _id: string;
  amount: number;
  mode: "CASH" | "UPI" | "CARD" | "NETBANKING";
  paidAt: string;
  remarks?: string;
  transactionId?: string;
  student?: Student;
  studentName?: string;
  studentPhone?: string;
}

interface PaymentFormState {
  studentId: string;
  amount: number;
  mode: "CASH" | "UPI" | "CARD" | "NETBANKING";
  transactionId: string;
  remarks: string;
}

const initialForm: PaymentFormState = {
  studentId: "",
  amount: 0,
  mode: "CASH",
  transactionId: "",
  remarks: "",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"ALL" | Payment["mode"]>("ALL");

  const [form, setForm] = useState<PaymentFormState>(initialForm);

  const selectedStudent = useMemo(
    () => students.find((s) => s._id === form.studentId),
    [students, form.studentId]
  );

  const fetchData = async () => {
    try {
      const [paymentsRes, studentsRes] = await Promise.all([
        fetch("/api/payments", { credentials: "include" }),
        fetch("/api/students", { credentials: "include" }),
      ]);

      const paymentsData = await paymentsRes.json();
      const studentsData = await studentsRes.json();

      if (paymentsData.success) setPayments(paymentsData.payments);
      if (studentsData.success) setStudents(studentsData.students);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        studentId: form.studentId,
        amount: form.amount,
        mode: form.mode,
        transactionId: form.transactionId || undefined,
        remarks: form.remarks || undefined,
      };

      const res = await fetch("/api/payments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Payment failed");
      }

      setOpen(false);
      setForm(initialForm);
      await fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSaving(false);
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const resolvedName = p.student?.name || p.studentName || "";
      const resolvedPhone = p.student?.phone || p.studentPhone || "";
      const query = `${resolvedName} ${resolvedPhone} ${p.mode} ${p.amount} ${
        p.transactionId || ""
      } ${p.remarks || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const modeOk = modeFilter === "ALL" ? true : p.mode === modeFilter;
      return query && modeOk;
    });
  }, [payments, search, modeFilter]);

  const totalCollected = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = filteredPayments.length;
  const averageTicket =
    totalTransactions === 0 ? 0 : Math.round(totalCollected / totalTransactions);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Payments</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manual payment ledger for manager entries. No gateway integration required.
              </p>
            </div>
            <Button onClick={() => setOpen(true)} className="inline-flex items-center gap-2">
              <Plus size={16} />
              Add Payment
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard title="Collected" value={`INR ${totalCollected}`} icon={<IndianRupee size={16} />} />
            <SummaryCard title="Transactions" value={`${totalTransactions}`} icon={<ReceiptText size={16} />} />
            <SummaryCard title="Average Ticket" value={`INR ${averageTicket}`} icon={<WalletCards size={16} />} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search student, amount, mode, reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value as "ALL" | Payment["mode"])}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="ALL">All Modes</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="NETBANKING">Net Banking</option>
          </select>
        </div>

        <div className="overflow-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 text-left">Student</th>
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">Mode</th>
                <th className="px-3 py-2 text-left">Reference</th>
                <th className="px-3 py-2 text-left">Remarks</th>
                <th className="px-3 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p._id} className="border-b last:border-none">
                  <td className="px-3 py-2">
                    <p className="font-medium text-slate-900">{p.student?.name || p.studentName || "-"}</p>
                    <p className="text-xs text-slate-500">{p.student?.phone || p.studentPhone || ""}</p>
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-900">INR {p.amount}</td>
                  <td className="px-3 py-2">{p.mode}</td>
                  <td className="px-3 py-2 text-slate-600">{p.transactionId || "-"}</td>
                  <td className="px-3 py-2 text-slate-600">{p.remarks || "-"}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {new Date(p.paidAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal open={open} onClose={() => setOpen(false)} title="Record Payment">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Student</label>
              <select
                value={form.studentId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    studentId: e.target.value,
                  }))
                }
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p>
                  Current Paid: <span className="font-semibold">INR {selectedStudent.feesPaid || 0}</span>
                </p>
                <p>
                  Current Pending:{" "}
                  <span className="font-semibold">INR {selectedStudent.pendingFees || 0}</span>
                </p>
              </div>
            )}

            <Input
              label="Amount"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
              required
            />

            <div>
              <label className="text-sm font-medium">Payment Mode</label>
              <select
                value={form.mode}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    mode: e.target.value as Payment["mode"],
                  }))
                }
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="NETBANKING">Net Banking</option>
              </select>
            </div>

            {(form.mode === "UPI" || form.mode === "CARD" || form.mode === "NETBANKING") && (
              <Input
                label="Transaction ID (Optional)"
                value={form.transactionId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    transactionId: e.target.value,
                  }))
                }
              />
            )}

            <Input
              label="Remarks (Optional)"
              value={form.remarks}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save Payment
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

function SummaryCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <span className="rounded-md border border-slate-200 bg-slate-50 p-1.5 text-slate-700">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
