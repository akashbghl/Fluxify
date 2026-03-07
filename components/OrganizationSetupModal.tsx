"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { maxShiftCountForPlan } from "@/lib/planLimits"

interface ShiftInput {
  shiftName: string
  startTime?: string
  endTime?: string
}

interface Props {
  open: boolean
  organizationId: string
  organizationPlan?: "FREE" | "PRO" | "ENTERPRISE" | string
  onSuccess: () => void
}

export default function OrganizationSetupModal({
  open,
  organizationId,
  organizationPlan,
  onSuccess,
}: Props) {
  const [totalSeats, setTotalSeats] = useState<number>(50)
  const [shifts, setShifts] = useState<ShiftInput[]>([
    {
      shiftName: "Shift 1",
      startTime: "",
      endTime: "",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const maxShifts = maxShiftCountForPlan(organizationPlan)

  if (!open) return null

  /* ================= ADD SHIFT ================= */

  const addShift = () => {
    if (shifts.length >= maxShifts) {
      setError(`Current plan allows up to ${maxShifts} shifts. Upgrade to add more.`)
      return
    }
    setShifts(prev => [
      ...prev,
      {
        shiftName: `Shift ${prev.length + 1}`,
        startTime: "",
        endTime: "",
      },
    ])
  }

  /* ================= REMOVE SHIFT ================= */

  const removeShift = (index: number) => {
    setShifts(prev => prev.filter((_, i) => i !== index))
  }

  /* ================= UPDATE SHIFT ================= */

  const updateShift = (
    index: number,
    field: keyof ShiftInput,
    value: string
  ) => {
    const updated = [...shifts]
    updated[index] = { ...updated[index], [field]: value }
    setShifts(updated)
  }

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    setError("")

    try {
      setLoading(true)

      const res = await fetch("/api/organization/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: organizationId,
          totalSeats,
          shifts,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Setup failed")
    }
    
    onSuccess()
} catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Setup failed")
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.55)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-100 px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Organization Setup
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Configure seats and shifts for your organization.
          </p>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-7">
          {/* TOTAL SEATS */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Total Seats in Organization
            </label>
            <input
              type="number"
              value={totalSeats}
              onChange={e => setTotalSeats(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </section>

          {/* SHIFTS */}
          <section className="space-y-4">
            {shifts.map((shift, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {shift.shiftName}
                  </h3>

                  {shifts.length > 1 && (
                    <button
                      onClick={() => removeShift(index)}
                      className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* SHIFT NAME */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">Shift Name</label>
                    <input
                      type="text"
                      value={shift.shiftName}
                      onChange={e =>
                        updateShift(index, "shiftName", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  {/* START TIME */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Start Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={shift.startTime}
                      onChange={e =>
                        updateShift(index, "startTime", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  {/* END TIME */}
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      End Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={shift.endTime}
                      onChange={e =>
                        updateShift(index, "endTime", e.target.value)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* ADD SHIFT */}
          <div>
            <button
              onClick={addShift}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={shifts.length >= maxShifts}
            >
              <Plus size={16} />
              Add Another Shift
            </button>
            <p className="mt-2 text-xs text-slate-500">
              Shift limit on current plan: {maxShifts}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Setting up..." : "Complete Setup"}
          </button>
        </div>
      </div>
    </div>
  )
}
