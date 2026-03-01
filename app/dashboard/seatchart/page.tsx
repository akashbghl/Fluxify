"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import OrganizationSetupModal from "@/components/OrganizationSetupModal";
import { StatCard } from "@/components/ReusableComponentsFunctions";
import {
  Users,
  UserX,
  UserCheck,
  Edit,
  Search,
  Armchair,
  Clock3,
  LayoutGrid,
} from "lucide-react";
import Loader from "@/components/ui/Loader";

type SeatStatus = "available" | "booked" | "selected";

interface Seat {
  id: number;
  status: SeatStatus;
  studentName?: string;
}

interface ShiftData {
  shiftName: string;
  totalSeats: number;
  seats: Seat[];
  startTime?: string;
  endTime?: string;
}

interface StudentApiItem {
  name?: string;
  status?: string;
  shiftName?: string;
  seatNumber?: number;
}

interface StudentsApiResponse {
  success?: boolean;
  students?: StudentApiItem[];
}

const generateSeats = (count: number): Seat[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    status: "available" as SeatStatus,
  }));

const seatStatusStyles: Record<SeatStatus, string> = {
  available:
    "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50",
  selected:
    "border-blue-600 bg-blue-600 text-white shadow-[0_8px_20px_-12px_rgba(37,99,235,0.8)]",
  booked:
    "border-rose-500 bg-rose-500 text-white cursor-not-allowed opacity-90",
};

export default function LibrarySeatPage() {
  const { organization, loading } = useAuth();

  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [activeShiftIndex, setActiveShiftIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"all" | SeatStatus>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!organization?.seatConfig?.shifts) return;

    const fetchBookedSeats = async () => {
      try {
        const res = await fetch("/api/students", { credentials: "include" });
        const data = (await res.json()) as StudentsApiResponse;
        if (!data.success || !Array.isArray(data.students)) return;

        const bookedStudents = data.students;

        const dynamicShifts: ShiftData[] = organization?.seatConfig?.shifts.map((shift) => {
          const seats = generateSeats(shift.totalSeats);

          bookedStudents.forEach((student) => {
            const seatNumber = student.seatNumber;
            if (
              student.shiftName === shift.shiftName &&
              student.status === "ACTIVE" &&
              typeof seatNumber === "number" &&
              seatNumber > 0
            ) {
              const seatIndex = seatNumber - 1;
              if (seats[seatIndex]) {
                seats[seatIndex].status = "booked";
                seats[seatIndex].studentName = student.name || "Student";
              }
            }
          });

          return {
            shiftName: shift.shiftName,
            totalSeats: shift.totalSeats,
            startTime: shift.startTime,
            endTime: shift.endTime,
            seats,
          };
        }) ?? [];

        setShifts(dynamicShifts);
        setActiveShiftIndex(0);
      } catch {
        setShifts([]);
      }
    };

    fetchBookedSeats();
  }, [organization]);

  const activeShift = shifts[activeShiftIndex];

  const analytics = useMemo(() => {
    if (!activeShift) {
      return { total: 0, booked: 0, available: 0, selected: 0, occupancy: 0 };
    }
    const total = activeShift.seats.length;
    const booked = activeShift.seats.filter((s) => s.status === "booked").length;
    const selected = activeShift.seats.filter((s) => s.status === "selected").length;
    const available = total - booked - selected;
    const occupancy = total === 0 ? 0 : Math.round(((booked + selected) / total) * 100);

    return { total, booked, available, selected, occupancy };
  }, [activeShift]);

  const filteredSeats = useMemo(() => {
    if (!activeShift) return [];
    const query = search.trim().toLowerCase();

    return activeShift.seats.filter((seat) => {
      const statusMatch = statusFilter === "all" ? true : seat.status === statusFilter;
      const searchMatch =
        query.length === 0 ||
        seat.id.toString().includes(query) ||
        (seat.studentName || "").toLowerCase().includes(query);

      return statusMatch && searchMatch;
    });
  }, [activeShift, statusFilter, search]);

  const selectedSeatIds = useMemo(() => {
    if (!activeShift) return [];
    return activeShift.seats.filter((s) => s.status === "selected").map((s) => s.id);
  }, [activeShift]);

  const toggleSeat = (seatId: number) => {
    if (!organization?.isConfigured) return;

    setShifts((prev) =>
      prev.map((shift, index) => {
        if (index !== activeShiftIndex) return shift;
        return {
          ...shift,
          seats: shift.seats.map((seat) => {
            if (seat.id !== seatId) return seat;
            if (seat.status === "booked") return seat;
            return {
              ...seat,
              status: seat.status === "available" ? "selected" : "available",
            };
          }),
        };
      })
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      {organization && (
        <OrganizationSetupModal
          open={!organization.isConfigured}
          organizationId={organization._id}
          onSuccess={() => window.location.reload()}
        />
      )}

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className={!organization?.isConfigured ? "pointer-events-none select-none blur-sm" : ""}>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {organization?.name} Seat Management
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Live overview of occupancy by shift with fast seat selection controls.
                </p>
              </div>
              <button
                onClick={() => {
                  window.location.href = "/dashboard/shifts/edit";
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <Edit className="h-4 w-4" />
                Edit Shifts
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <StatCard
                title="Total Seats"
                value={analytics.total}
                icon={<Users className="h-5 w-5 text-white" />}
                gradient="from-slate-500 to-slate-700"
              />
              <StatCard
                title="Available"
                value={analytics.available}
                icon={<Armchair className="h-5 w-5 text-white" />}
                gradient="from-emerald-500 to-green-600"
              />
              <StatCard
                title="Booked"
                value={analytics.booked}
                icon={<UserX className="h-5 w-5 text-white" />}
                gradient="from-rose-500 to-red-600"
              />
              <StatCard
                title="Selected"
                value={analytics.selected}
                icon={<UserCheck className="h-5 w-5 text-white" />}
                gradient="from-blue-500 to-indigo-600"
              />
              <StatCard
                title="Occupancy %"
                value={`${analytics.occupancy}%`}
                icon={<LayoutGrid className="h-5 w-5 text-white" />}
                gradient="from-amber-500 to-orange-600"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Shift Selection</h2>
              <p className="text-xs text-slate-500">Choose shift to inspect seats</p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {shifts.map((shift, index) => {
                const isActive = activeShiftIndex === index;
                const bookedCount = shift.seats.filter((s) => s.status === "booked").length;
                return (
                  <button
                    key={shift.shiftName}
                    onClick={() => setActiveShiftIndex(index)}
                    className={`min-w-[190px] rounded-xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-semibold">{shift.shiftName}</p>
                    <p className={`mt-0.5 text-xs ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                      {shift.startTime && shift.endTime ? (
                        <>
                          <Clock3 className="mr-1 inline h-3 w-3" />
                          {shift.startTime} - {shift.endTime}
                        </>
                      ) : (
                        "Custom time"
                      )}
                    </p>
                    <p className={`mt-2 text-xs ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                      {bookedCount}/{shift.totalSeats} booked
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {activeShift?.shiftName || "Shift"} Seat Layout
                </h3>
                <p className="text-sm text-slate-500">
                  Click available seats to mark temporary selection.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <FilterChip
                  active={statusFilter === "all"}
                  label="All"
                  onClick={() => setStatusFilter("all")}
                />
                <FilterChip
                  active={statusFilter === "available"}
                  label="Available"
                  onClick={() => setStatusFilter("available")}
                />
                <FilterChip
                  active={statusFilter === "selected"}
                  label="Selected"
                  onClick={() => setStatusFilter("selected")}
                />
                <FilterChip
                  active={statusFilter === "booked"}
                  label="Booked"
                  onClick={() => setStatusFilter("booked")}
                />
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by seat no. or student name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </div>
              <div className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filteredSeats.length}</span> of{" "}
                <span className="font-semibold text-slate-700">{analytics.total}</span> seats
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2.5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16">
              {filteredSeats.map((seat) => (
                <div key={seat.id} className="group relative">
                  <button
                    onClick={() => toggleSeat(seat.id)}
                    disabled={seat.status === "booked"}
                    className={`w-full rounded-lg border px-2 py-2 text-sm font-semibold transition ${seatStatusStyles[seat.status]}`}
                    title={`Seat ${seat.id} - ${seat.status}${seat.studentName ? ` (${seat.studentName})` : ""}`}
                  >
                    {seat.id}
                  </button>
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 w-max max-w-[220px] -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                    Seat {seat.id} - {seat.status.toUpperCase()}
                    {seat.studentName ? ` (${seat.studentName})` : ""}
                  </div>
                </div>
              ))}
            </div>

            {filteredSeats.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm text-slate-500">
                No seats match the current filters.
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-6 text-sm">
              <Legend color="bg-white border border-slate-300" label="Available" />
              <Legend color="bg-blue-600" label="Selected" />
              <Legend color="bg-rose-500" label="Booked" />
            </div>

            {selectedSeatIds.length > 0 && (
              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/60 p-3">
                <p className="text-xs font-medium text-blue-700">Selected Seats</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSeatIds.map((id) => (
                    <span
                      key={id}
                      className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700"
                    >
                      #{id}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-4 w-4 rounded ${color}`} />
      <span className="text-slate-600">{label}</span>
    </div>
  );
}
