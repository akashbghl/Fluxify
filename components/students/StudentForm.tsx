"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ShiftOption {
  shiftName: string;
  totalSeats: number;
}

export interface StudentFormData {
  name: string;
  email?: string;
  phone: string;
  plan: "1_MONTH" | "3_MONTH" | "6_MONTH" | "12_MONTH";
  shiftName?: string;
  seatNumber?: number;
  startDate: string;
  feesPaid: number;
  pendingFees?: number;
}

interface StudentFormProps {
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => Promise<void> | void;
  loading?: boolean;
  shifts: ShiftOption[];
  checkSeatAvailability: (
    shiftName: string,
    seatNumber: number
  ) => Promise<boolean>;
}

const PLAN_OPTIONS = [
  { label: "1 Month", value: "1_MONTH" },
  { label: "3 Months", value: "3_MONTH" },
  { label: "6 Months", value: "6_MONTH" },
  { label: "12 Months", value: "12_MONTH" },
];

export default function StudentForm({
  initialData,
  onSubmit,
  loading,
  shifts,
  checkSeatAvailability,
}: StudentFormProps) {
  const [form, setForm] = useState<StudentFormData>({
    name: "",
    email: "",
    phone: "",
    plan: "1_MONTH",
    seatNumber: undefined,
    shiftName: "",
    startDate: new Date().toISOString().split("T")[0],
    feesPaid: 0,
    pendingFees: 0,
    ...initialData,
  });

  const [seatStatus, setSeatStatus] = useState<
    "idle" | "checking" | "available" | "not_available"
  >("idle");

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "feesPaid" ||
      name === "pendingFees" ||
      name === "seatNumber"
        ? Number(value)
        : value;

    const updatedForm = {
      ...form,
      [name]: updatedValue,
    };

    setForm(updatedForm);

    // Reset status if shift changes
    if (name === "shiftName") {
      setSeatStatus("idle");
    }

    // Seat availability check
    if (
      (name === "seatNumber" || name === "shiftName") &&
      updatedForm.shiftName &&
      updatedForm.seatNumber &&
      updatedForm.seatNumber > 0
    ) {
      setSeatStatus("checking");

      try {
        const available = await checkSeatAvailability(
          updatedForm.shiftName,
          updatedForm.seatNumber
        );

        setSeatStatus(available ? "available" : "not_available");
      } catch {
        setSeatStatus("idle");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (seatStatus === "not_available") {
      alert("Seat is already booked!");
      return;
    }

    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />

      <Input
        label="Phone"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        required
      />

      {/* Plan */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Subscription Plan</label>
        <select
          name="plan"
          value={form.plan}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black"
        >
          {PLAN_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Shift Selection */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Shift</label>
        <select
          name="shiftName"
          value={form.shiftName || ""}
          onChange={handleChange}
          required
          className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black"
        >
          <option value="">Select Shift</option>
          {shifts?.map((shift) => (
            <option key={shift.shiftName} value={shift.shiftName}>
              {shift.shiftName}
            </option>
          ))}
        </select>
      </div>

      {/* Seat Number */}
      <div>
        <Input
          label="Seat Number"
          name="seatNumber"
          type="number"
          value={form.seatNumber ?? ""}
          onChange={handleChange}
          min={1}
        />

        {seatStatus === "checking" && (
          <p className="text-sm text-gray-500 mt-1">
            Checking availability...
          </p>
        )}

        {seatStatus === "available" && (
          <p className="text-sm text-green-600 mt-1">
            Seat is available ✅
          </p>
        )}

        {seatStatus === "not_available" && (
          <p className="text-sm text-red-600 mt-1">
            Seat is already booked ❌
          </p>
        )}
      </div>

      <Input
        label="Start Date"
        name="startDate"
        type="date"
        value={form.startDate}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Fees Paid"
          name="feesPaid"
          type="number"
          value={form.feesPaid}
          onChange={handleChange}
        />

        <Input
          label="Pending Fees"
          name="pendingFees"
          type="number"
          value={form.pendingFees}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          loading={loading}
          disabled={seatStatus === "not_available"}
        >
          Save Student
        </Button>
      </div>
    </form>
  );
}