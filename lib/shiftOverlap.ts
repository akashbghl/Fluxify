export interface ShiftTimingLike {
  shiftName: string;
  startTime?: string;
  endTime?: string;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toIntervals(shift: ShiftTimingLike): Array<[number, number]> {
  if (!shift.startTime || !shift.endTime) return [];

  const start = toMinutes(shift.startTime);
  const end = toMinutes(shift.endTime);

  // Same start and end means full-day coverage.
  if (start === end) return [[0, 1440]];

  if (end > start) return [[start, end]];

  // Overnight shift (e.g. 20:00 to 08:00).
  return [
    [start, 1440],
    [0, end],
  ];
}

export function doShiftsOverlap(a: ShiftTimingLike, b: ShiftTimingLike): boolean {
  const aIntervals = toIntervals(a);
  const bIntervals = toIntervals(b);

  // Fallback for untimed shifts: only identical shift names overlap.
  if (aIntervals.length === 0 || bIntervals.length === 0) {
    return a.shiftName === b.shiftName;
  }

  for (const [aStart, aEnd] of aIntervals) {
    for (const [bStart, bEnd] of bIntervals) {
      if (Math.max(aStart, bStart) < Math.min(aEnd, bEnd)) {
        return true;
      }
    }
  }

  return false;
}

export function getOverlappingShiftNames(
  selectedShiftName: string,
  shifts: ShiftTimingLike[]
): string[] {
  const selected = shifts.find((s) => s.shiftName === selectedShiftName);
  if (!selected) return [selectedShiftName];

  return shifts
    .filter((shift) => doShiftsOverlap(selected, shift))
    .map((shift) => shift.shiftName);
}
