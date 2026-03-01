export interface StudentShiftLike {
  shiftName?: string;
  shiftNames?: string[];
}

export function normalizeStudentShiftNames(input: StudentShiftLike): string[] {
  const fromArray = Array.isArray(input.shiftNames)
    ? input.shiftNames.map((s) => s.trim()).filter(Boolean)
    : [];

  if (fromArray.length > 0) {
    return Array.from(new Set(fromArray));
  }

  if (input.shiftName?.trim()) {
    return [input.shiftName.trim()];
  }

  return [];
}

export function getPrimaryShiftName(input: StudentShiftLike): string {
  return normalizeStudentShiftNames(input)[0] || "";
}
