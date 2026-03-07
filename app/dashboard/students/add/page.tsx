"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  const [origin, setOrigin] = useState("");
  const [initialData, setInitialData] = useState<Partial<StudentFormData>>({
    name: "",
    email: "",
    phone: "",
    plan: "1_MONTH",
    shiftNames: [],
  });
  const allowMultiShift = organization?.plan !== "FREE";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);

      const params = new URLSearchParams(window.location.search);
      const shiftQuery = params.get("shiftNames") || "";
      const shiftNames = shiftQuery
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const planValue = params.get("plan");
      const validPlans = ["1_MONTH", "3_MONTH", "6_MONTH", "12_MONTH"];
      const plan =
        planValue && validPlans.includes(planValue)
          ? (planValue as StudentFormData["plan"])
          : "1_MONTH";

      setInitialData({
        name: params.get("name") || "",
        email: params.get("email") || "",
        phone: params.get("phone") || "",
        plan,
        shiftNames,
      });
    }
  }, []);

  const shifts =
    organization?.seatConfig?.shifts?.map((shift) => ({
      shiftName: shift.shiftName,
      totalSeats: shift.totalSeats,
    })) || [];

  const joinUrl =
    organization?.slug && origin
      ? `${origin}/join/${organization.slug}`
      : "";
  const qrCodeUrl = joinUrl
    ? `https://quickchart.io/qr?size=220&text=${encodeURIComponent(joinUrl)}`
    : "";

  // ✅ Seat Availability Checker
  const checkSeatAvailability = async (
    shiftNames: string[],
    seatNumber: number
  ) => {
    try {
      const res = await fetch("/api/students/check-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shiftNames,
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
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      if (formData.feesPaid > 0 && !data.initialPaymentRecorded) {
        throw new Error("Initial payment was not recorded.");
      }

      router.push("/dashboard/students");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Failed to create student");
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
          {joinUrl && (
            <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Student Self Registration QR
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Students can scan this QR and submit details. You will receive an email to verify and register them.
              </p>
              <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Image
                  src={qrCodeUrl}
                  alt="Student registration QR code"
                  width={128}
                  height={128}
                  unoptimized
                  className="h-32 w-32 rounded-lg border border-slate-200 bg-white p-1"
                />
                <div className="space-y-2">
                  <p className="max-w-xs break-all text-xs text-slate-500">{joinUrl}</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(joinUrl)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Copy Form Link
                  </button>
                </div>
              </div>
            </div>
          )}

          <StudentForm
            initialData={initialData}
            onSubmit={handleCreateStudent}
            loading={saving}
            shifts={shifts}
            checkSeatAvailability={checkSeatAvailability}
            showPaymentMeta
            allowMultiShift={allowMultiShift}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
