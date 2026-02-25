"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import OrganizationSetupModal from "@/components/OrganizationSetupModal"
import { StatCard } from "@/components/ReusableComponentsFunctions"
import { Users, UserX, UserCheck } from "lucide-react"

type SeatStatus = "available" | "booked" | "selected"

interface Seat {
  id: number
  status: SeatStatus
}

interface ShiftData {
  shiftName: string
  totalSeats: number
  seats: Seat[]
}

/**
 * Generate seats dynamically
 */
const generateSeats = (count: number, bookedIndexes: number[] = []): Seat[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: bookedIndexes.includes(i + 1) ? "booked" : "available",
  }))
}

export default function LibrarySeatPage() {
  const { user, organization, loading } = useAuth()

  const [shifts, setShifts] = useState<ShiftData[]>([])
  const [activeShiftIndex, setActiveShiftIndex] = useState(0)

  // Load shifts from organization seatConfig
  useEffect(() => {
    if (organization?.seatConfig?.shifts) {
      const dynamicShifts: ShiftData[] = organization.seatConfig.shifts.map((shift) => ({
        shiftName: shift.shiftName,
        totalSeats: shift.totalSeats,
        seats: generateSeats(
          shift.totalSeats,
          [] // TODO: fetch booked seat IDs if available
        ),
      }))
      setShifts(dynamicShifts)
      setActiveShiftIndex(0)
    }
  }, [organization])

  const activeShift = shifts[activeShiftIndex]

  const analytics = useMemo(() => {
    if (!activeShift) return { total: 0, booked: 0, available: 0, selected: 0, occupancy: 0 }
    const total = activeShift.seats.length
    const booked = activeShift.seats.filter(s => s.status === "booked").length
    const selected = activeShift.seats.filter(s => s.status === "selected").length
    const available = total - booked - selected
    const occupancy = total === 0 ? 0 : Math.round(((booked + selected) / total) * 100)

    return { total, booked, available, selected, occupancy }
  }, [activeShift?.seats])

  const toggleSeat = (seatId: number) => {
    if (!organization?.isConfigured) return

    setShifts(prev =>
      prev.map((shift, index) => {
        if (index !== activeShiftIndex) return shift

        return {
          ...shift,
          seats: shift.seats.map(seat => {
            if (seat.id !== seatId) return seat
            if (seat.status === "booked") return seat
            return { ...seat, status: seat.status === "available" ? "selected" : "available" }
          }),
        }
      })
    )
  }

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen">

      {/* ================= SETUP MODAL ================= */}
      {organization && (
        <OrganizationSetupModal
          open={!organization.isConfigured}
          organizationId={organization._id}
          onSuccess={() => window.location.reload()}
        />
      )}

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">

        {/* Blur content if not configured */}
        <div className={!organization?.isConfigured ? "pointer-events-none blur-sm select-none" : ""}>

          {/* HEADER */}
          <div className="mb-3">
            <h1 className="text-3xl font-bold text-gray-800">
              Library Seat Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and visualize seat availability across shifts
            </p>
          </div>

          {/* ANALYTICS PANEL */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            <StatCard
              title="Total Seats"
              value={analytics.total}
              icon={<Users className="w-5 h-5 text-white" />}
              gradient="from-slate-500 to-slate-700"
            />
            <StatCard
              title="Available"
              value={analytics.available}
              icon={<Users className="w-5 h-5 text-white" />}
              gradient="from-emerald-500 to-green-600"
            />
            <StatCard
              title="Booked"
              value={analytics.booked}
              icon={<UserX className="w-5 h-5 text-white" />}
              gradient="from-rose-500 to-red-600"
            />
            <StatCard
              title="Selected"
              value={analytics.selected}
              icon={<UserCheck className="w-5 h-5 text-white" />}
              gradient="from-blue-500 to-indigo-600"
            />
            <StatCard
              title="Occupancy %"
              value={`${analytics.occupancy}%`}
              icon={<Users className="w-5 h-5 text-white" />}
              gradient="from-purple-500 to-violet-600"
            />
          </div>

          {/* SHIFT TABS */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {shifts.map((shift, index) => (
              <button
                key={shift.shiftName}
                onClick={() => setActiveShiftIndex(index)}
                className={`px-5 py-2 rounded-lg font-medium transition ${activeShiftIndex === index
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {shift.shiftName}
              </button>
            ))}
          </div>

          {/* SEAT GRID */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-6">
              {activeShift?.shiftName || "Shift"} Seat Layout
            </h2>

            <div className="grid grid-cols-6 md:grid-cols-12 lg:grid-cols-20 gap-3">
              {activeShift?.seats.map(seat => (
                <button
                  key={seat.id}
                  onClick={() => toggleSeat(seat.id)}
                  disabled={seat.status === "booked"}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition
                    ${seat.status === "available" && "bg-gray-200 hover:bg-green-400 hover:text-white"}
                    ${seat.status === "selected" && "bg-blue-600 text-white shadow-md"}
                    ${seat.status === "booked" && "bg-red-500 text-white cursor-not-allowed opacity-80"}
                  `}
                >
                  {seat.id}
                </button>
              ))}
            </div>

            {/* LEGEND */}
            <div className="flex gap-6 mt-8 text-sm">
              <Legend color="bg-gray-300" label="Available" />
              <Legend color="bg-blue-600" label="Selected" />
              <Legend color="bg-red-500" label="Booked" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= LEGEND ================= */
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span className="text-gray-600">{label}</span>
    </div>
  )
}