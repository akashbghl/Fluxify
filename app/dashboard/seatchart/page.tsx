"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import OrganizationSetupModal from "@/components/OrganizationSetupModal"
import { StatCard } from "@/components/ReusableComponentsFunctions"
import { Users, UserX, UserCheck, Edit } from "lucide-react"

type SeatStatus = "available" | "booked" | "selected"

interface Seat {
  id: number
  status: SeatStatus
  studentName?: string
}

interface ShiftData {
  shiftName: string
  totalSeats: number
  seats: Seat[]
  startTime?: string
  endTime?: string
}

/* Generate seats dynamically */
const generateSeats = (count: number): Seat[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: "available" as SeatStatus,
  }))

export default function LibrarySeatPage() {
  const { user, organization, loading } = useAuth()

  const [shifts, setShifts] = useState<ShiftData[]>([])
  const [activeShiftIndex, setActiveShiftIndex] = useState(0)

  /* ================= Load shifts + booked seats ================= */
  useEffect(() => {
    if (!organization?.seatConfig?.shifts) return

    const fetchBookedSeats = async () => {
      try {
        // Fetch students from API
        const res = await fetch("/api/students", { credentials: "include" })
        const data = await res.json()

        if (!data.success) return

        const bookedStudents = data.students

        const dynamicShifts: ShiftData[] = organization.seatConfig!.shifts.map(shift => {
          const seats = generateSeats(shift.totalSeats)

          // Map booked seats for this shift
          bookedStudents.forEach((student: any) => {
            if (student.shiftName === shift.shiftName && student.status === "ACTIVE") {
              const seatIndex = student.seatNumber - 1
              if (seats[seatIndex]) {
                seats[seatIndex].status = "booked"
                seats[seatIndex].studentName = student.name
              }
            }
          })

          return {
            shiftName: shift.shiftName,
            totalSeats: shift.totalSeats,
            startTime: shift.startTime,
            endTime: shift.endTime,
            seats,
          }
        })

        setShifts(dynamicShifts)
        setActiveShiftIndex(0)
      } catch (err) {
        console.error("Failed to load booked seats", err)
      }
    }

    fetchBookedSeats()
  }, [organization])

  const activeShift = shifts[activeShiftIndex]

  /* ================= Analytics ================= */
  const analytics = useMemo(() => {
    if (!activeShift) return { total: 0, booked: 0, available: 0, selected: 0, occupancy: 0 }
    const total = activeShift.seats.length
    const booked = activeShift.seats.filter(s => s.status === "booked").length
    const selected = activeShift.seats.filter(s => s.status === "selected").length
    const available = total - booked - selected
    const occupancy = total === 0 ? 0 : Math.round(((booked + selected) / total) * 100)
    return { total, booked, available, selected, occupancy }
  }, [activeShift?.seats])

  /* ================= Toggle Seat ================= */
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

  /* ================= Loading ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen">
      {organization && (
        <OrganizationSetupModal
          open={!organization.isConfigured}
          organizationId={organization._id}
          onSuccess={() => window.location.reload()}
        />
      )}

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
        <div className={!organization?.isConfigured ? "pointer-events-none blur-sm select-none" : ""}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{organization?.name} Seat Management</h1>
          <p className="text-gray-500 mb-6">Manage and visualize seat availability across shifts</p>

          {/* Analytics */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            <StatCard title="Total Seats" value={analytics.total} icon={<Users className="w-5 h-5 text-white" />} gradient="from-slate-500 to-slate-700" />
            <StatCard title="Available" value={analytics.available} icon={<Users className="w-5 h-5 text-white" />} gradient="from-emerald-500 to-green-600" />
            <StatCard title="Booked" value={analytics.booked} icon={<UserX className="w-5 h-5 text-white" />} gradient="from-rose-500 to-red-600" />
            <StatCard title="Selected" value={analytics.selected} icon={<UserCheck className="w-5 h-5 text-white" />} gradient="from-blue-500 to-indigo-600" />
            <StatCard title="Occupancy %" value={`${analytics.occupancy}%`} icon={<Users className="w-5 h-5 text-white" />} gradient="from-purple-500 to-violet-600" />
          </div>

          {/* Shift Tabs */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {shifts.map((shift, index) => (
              <button key={shift.shiftName} onClick={() => setActiveShiftIndex(index)} className={`px-5 py-2 rounded-lg font-medium transition ${activeShiftIndex === index ? "bg-blue-600 text-white shadow" : "bg-white border text-gray-600 hover:bg-gray-100"}`}>
                <div>{shift.shiftName}</div>
                {shift.startTime && shift.endTime && <div className="text-xs opacity-80">{shift.startTime} - {shift.endTime}</div>}
              </button>
            ))}
            <button onClick={() => { window.location.href = "/dashboard/shifts/edit" }} className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Edit Shifts <Edit className="ml-2 inline w-4 h-4" /></button>
          </div>

          {/* Seat Grid */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-6">{activeShift?.shiftName || "Shift"} Seat Layout</h2>
            <div className="grid grid-cols-6 md:grid-cols-12 lg:grid-cols-20 gap-3">
              {activeShift?.seats.map(seat => (
                <div key={seat.id} className="relative group">
                  <button
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
                  {/* Tooltip */}
                  <div className="absolute z-10 bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                    Seat {seat.id} - {seat.status.toUpperCase()} {seat.studentName && `(${seat.studentName})`}
                  </div>
                </div>
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