"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

interface ShiftInput {
  shiftName: string
  totalSeats: number
  startTime?: string
  endTime?: string
}

interface Props {
  open: boolean
  organizationId: string
  onSuccess: () => void
}

export default function OrganizationSetupModal({
  open,
  organizationId,
  onSuccess,
}: Props) {
  const [totalSeats, setTotalSeats] = useState<number>(50)
  const [shifts, setShifts] = useState<ShiftInput[]>([
    {
      shiftName: "Shift 1",
      totalSeats: 50,
      startTime: "",
      endTime: "",
    },
  ])
  console.log("Organization ID in Modal:", organizationId)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  /* ================= ADD SHIFT ================= */

  const addShift = () => {
    setShifts(prev => [
      ...prev,
      {
        shiftName: `Shift ${prev.length + 1}`,
        totalSeats: 0,
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
    value: string | number
  ) => {
    const updated = [...shifts]
    updated[index] = { ...updated[index], [field]: value }
    setShifts(updated)
  }

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    setError("")

    const totalShiftSeats = shifts.reduce(
      (sum, shift) => sum + Number(shift.totalSeats),
      0
    )

    if (totalShiftSeats > totalSeats) {
      setError("Shift seats cannot exceed total seats")
      return
    }

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
      console.log("Setup Response:", res)

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Setup failed")
    }
    
    onSuccess()
} catch (err: any) {
    setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Organization Setup
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Configure seats and shifts for your organization.
          </p>
        </div>

        {/* TOTAL SEATS */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Total Seats in Organization
          </label>
          <input
            type="number"
            value={totalSeats}
            onChange={e => setTotalSeats(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* SHIFTS */}
        <div className="space-y-6">
          {shifts.map((shift, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 sm:p-5 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  {shift.shiftName}
                </h3>

                {shifts.length > 1 && (
                  <button
                    onClick={() => removeShift(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* SHIFT NAME */}
                <div>
                  <label className="text-sm font-medium">Shift Name</label>
                  <input
                    type="text"
                    value={shift.shiftName}
                    onChange={e =>
                      updateShift(index, "shiftName", e.target.value)
                    }
                    className="w-full mt-1 border rounded-lg px-3 py-2"
                  />
                </div>

                {/* SHIFT SEATS */}
                <div>
                  <label className="text-sm font-medium">Shift Seats</label>
                  <input
                    type="number"
                    value={shift.totalSeats}
                    onChange={e =>
                      updateShift(index, "totalSeats", Number(e.target.value))
                    }
                    className="w-full mt-1 border rounded-lg px-3 py-2"
                  />
                </div>

                {/* START TIME */}
                <div>
                  <label className="text-sm font-medium">
                    Start Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={shift.startTime}
                    onChange={e =>
                      updateShift(index, "startTime", e.target.value)
                    }
                    className="w-full mt-1 border rounded-lg px-3 py-2"
                  />
                </div>

                {/* END TIME */}
                <div>
                  <label className="text-sm font-medium">
                    End Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={shift.endTime}
                    onChange={e =>
                      updateShift(index, "endTime", e.target.value)
                    }
                    className="w-full mt-1 border rounded-lg px-3 py-2"
                  />
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* ADD SHIFT */}
        <button
          onClick={addShift}
          className="mt-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <Plus size={18} />
          Add Another Shift
        </button>

        {/* ERROR */}
        {error && (
          <div className="mt-4 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
        >
          {loading ? "Setting up..." : "Complete Setup"}
        </button>
      </div>
    </div>
  )
}