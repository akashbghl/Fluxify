"use client";

import { Calendar, Phone, Mail, Pencil, Trash, Clock, Armchair } from "lucide-react";
import Button from "@/components/ui/Button";
import clsx from "clsx";
import { normalizeStudentShiftNames } from "@/lib/studentShift";

export interface Student {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  plan: string;
  shiftName?: string;
  shiftNames?: string[];
  seatNumber: number;
  expiryDate: string;
  status: "ACTIVE" | "EXPIRED";
}

interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
}

export default function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  const expiry = new Date(student.expiryDate);
  const computedStatus = student.status;
  const shiftNames = normalizeStudentShiftNames({
    shiftName: student.shiftName,
    shiftNames: student.shiftNames,
  });

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{student.name}</h3>

        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            computedStatus === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {computedStatus}
        </span>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        {student.email && (
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span>{student.email}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Phone size={14} />
          <span>{student.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>Shifts: {shiftNames.join(", ") || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Armchair size={14} />
          <span>Seat: {student.seatNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>
            Expires on {expiry.toLocaleDateString()} (
            {computedStatus === "ACTIVE" ? "Active" : "Expired"})
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => onEdit?.(student)}>
          <Pencil size={14} className="mr-1" />
          Edit
        </Button>

        <Button variant="danger" className="flex-1" onClick={() => onDelete?.(student._id)}>
          <Trash size={14} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}
