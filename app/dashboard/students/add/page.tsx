"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import StudentForm, {
  StudentFormData,
} from "@/components/students/StudentForm";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function AddStudentPage() {
  const router = useRouter();
  const { organization } = useAuth();
  const [saving, setSaving] = useState(false);

  const shifts =
    organization?.seatConfig?.shifts?.map((shift: any) => ({
      shiftName: shift.shiftName,
      totalSeats: shift.totalSeats,
    })) || [];

  // ✅ Seat Availability Checker
  const checkSeatAvailability = async (
    shiftName: string,
    seatNumber: number
  ) => {
    try {
      const res = await fetch("/api/students/check-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: organization?._id,
          shiftName,
          seatNumber,
        }),
      });

      const data = await res.json();
      return data.available;
    } catch {
      return false;
    }
  };

  const handleCreateStudent = async (
    formData: StudentFormData
  ) => {
    setSaving(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          organizationId: organization?._id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      router.push("/dashboard/students");
    } catch (error) {
      alert("Failed to create student");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-xl space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            Add Student
          </h1>

          <Button
            variant="outline"
            onClick={() =>
              router.push("/dashboard/students")
            }
          >
            Back
          </Button>
        </div>

        {/* Form */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <StudentForm
            onSubmit={handleCreateStudent}
            loading={saving}
            shifts={shifts}
            checkSeatAvailability={checkSeatAvailability}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}