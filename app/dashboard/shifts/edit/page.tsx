"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Trash2, ArrowLeftRight, Clock3 } from "lucide-react";
import { doShiftsOverlap } from "@/lib/shiftOverlap";

interface ShiftInput {
  shiftName: string;
  startTime?: string;
  endTime?: string;
}

function hasOverlap(shifts: ShiftInput[]) {
  for (let i = 0; i < shifts.length; i++) {
    for (let j = i + 1; j < shifts.length; j++) {
      if (doShiftsOverlap(shifts[i], shifts[j])) return true;
    }
  }

  return false;
}

export default function EditShiftsPage() {
  const router = useRouter();
  const { organization, loading } = useAuth();

  const [totalSeats, setTotalSeats] = useState(0);
  const [shifts, setShifts] = useState<ShiftInput[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!organization?.seatConfig) return;
    setTotalSeats(organization.seatConfig.totalSeats || 0);
    setShifts(
      organization.seatConfig.shifts.map((shift) => ({
        shiftName: shift.shiftName,
        startTime: shift.startTime || "",
        endTime: shift.endTime || "",
      }))
    );
  }, [organization]);

  const addShift = () => {
    setShifts((prev) => [
      ...prev,
      {
        shiftName: `Shift ${prev.length + 1}`,
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const removeShift = (index: number) => {
    setShifts((prev) => prev.filter((_, i) => i !== index));
  };

  const updateShift = (
    index: number,
    field: keyof ShiftInput,
    value: string
  ) => {
    setShifts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const validate = () => {
    if (!totalSeats || totalSeats <= 0) return "Total seats must be greater than 0.";
    if (shifts.length === 0) return "Add at least one shift.";
    if (shifts.some((s) => !s.shiftName.trim())) return "All shifts must have a name.";
    if (hasOverlap(shifts)) return "Shift timings overlap. Please adjust timings.";
    return null;
  };

  const saveChanges = async () => {
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/organization/setup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          totalSeats,
          shifts,
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update shifts.");
      }

      setSuccess("Shifts updated successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update shifts.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!organization) {
    return (
      <ProtectedRoute>
        <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">
          Unable to load organization details.
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Edit Shifts</h1>
              <p className="mt-1 text-sm text-slate-600">
                Update shift names, capacities, and timings for {organization.name}.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/seatchart")}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeftRight size={16} />
              Back to Seat Chart
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              type="number"
              label="Total Seats"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              min={1}
            />
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Shift Count</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{shifts.length}</p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <p className="text-xs text-slate-500">Seat Rule</p>
              <p className="mt-1 text-sm font-semibold text-sky-800">
                Same seat pool shared across all shifts
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {shifts.map((shift, index) => (
              <div key={`${shift.shiftName}-${index}`} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium text-slate-800">Shift {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeShift(index)}
                    disabled={shifts.length === 1}
                    className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Remove shift"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input
                    label="Shift Name"
                    value={shift.shiftName}
                    onChange={(e) => updateShift(index, "shiftName", e.target.value)}
                  />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="time"
                        value={shift.startTime}
                        onChange={(e) => updateShift(index, "startTime", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="time"
                        value={shift.endTime}
                        onChange={(e) => updateShift(index, "endTime", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addShift}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <Plus size={16} />
            Add Shift
          </button>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={saveChanges} loading={saving}>
              Save Shift Configuration
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/seatchart")}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
