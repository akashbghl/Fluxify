"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { normalizeStudentShiftNames } from "@/lib/studentShift";

interface ShiftOption {
  shiftName: string;
  totalSeats: number;
}

export interface StudentFormData {
  name: string;
  email?: string;
  phone: string;
  plan: "1_MONTH" | "3_MONTH" | "6_MONTH" | "12_MONTH";
  shiftNames: string[];
  seatNumber?: number;
  startDate: string;
  feesPaid: number;
  pendingFees?: number;
  paymentMode?: "CASH" | "UPI" | "CARD" | "NETBANKING";
  transactionId?: string;
  paymentRemarks?: string;
}

interface StudentFormProps {
  initialData?: Partial<StudentFormData> & {
    shiftName?: string;
  };
  onSubmit: (data: StudentFormData) => Promise<void> | void;
  loading?: boolean;
  shifts: ShiftOption[];
  checkSeatAvailability: (
    shiftNames: string[],
    seatNumber: number
  ) => Promise<boolean>;
  showPaymentMeta?: boolean;
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
  showPaymentMeta = true,
}: StudentFormProps) {
  const [form, setForm] = useState<StudentFormData>({
    name: "",
    email: "",
    phone: "",
    plan: "1_MONTH",
    seatNumber: undefined,
    shiftNames: normalizeStudentShiftNames({
      shiftName: initialData?.shiftName,
      shiftNames: initialData?.shiftNames,
    }),
    startDate: new Date().toISOString().split("T")[0],
    feesPaid: 0,
    pendingFees: 0,
    paymentMode: "CASH",
    transactionId: "",
    paymentRemarks: "",
    ...initialData,
  });

  const [seatStatus, setSeatStatus] = useState<
    "idle" | "checking" | "available" | "not_available"
  >("idle");

  useEffect(() => {
    let active = true;

    const runSeatCheck = async () => {
      if (
        form.shiftNames.length === 0 ||
        !form.seatNumber ||
        form.seatNumber <= 0
      ) {
        if (active) setSeatStatus("idle");
        return;
      }

      if (active) setSeatStatus("checking");
      try {
        const available = await checkSeatAvailability(
          form.shiftNames,
          form.seatNumber
        );
        if (active) {
          setSeatStatus(available ? "available" : "not_available");
        }
      } catch {
        if (active) setSeatStatus("idle");
      }
    };

    runSeatCheck();

    return () => {
      active = false;
    };
  }, [form.shiftNames, form.seatNumber, checkSeatAvailability]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedValue =
      name === "feesPaid" || name === "pendingFees" || name === "seatNumber"
        ? Number(value)
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const toggleShift = (shiftName: string) => {
    setForm((prev) => {
      const exists = prev.shiftNames.includes(shiftName);
      const shiftNames = exists
        ? prev.shiftNames.filter((s) => s !== shiftName)
        : [...prev.shiftNames, shiftName];

      return { ...prev, shiftNames };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.shiftNames.length === 0) {
      alert("Please select at least one shift.");
      return;
    }

    if (seatStatus === "not_available") {
      alert("Seat is already booked for one of the selected/overlapping shifts.");
      return;
    }

    await onSubmit({
      ...form,
      shiftNames: normalizeStudentShiftNames({
        shiftNames: form.shiftNames,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleInputChange}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleInputChange}
      />

      <Input
        label="Phone"
        name="phone"
        value={form.phone}
        onChange={handleInputChange}
        required
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">Subscription Plan</label>
        <select
          name="plan"
          value={form.plan}
          onChange={handleInputChange}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black"
        >
          {PLAN_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Shifts (Select one or more)</label>
        {form.shiftNames.length > 0 && (
          <p className="text-xs text-gray-500">
            Selected: {form.shiftNames.join(", ")}
          </p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {shifts?.map((shift) => {
            const checked = form.shiftNames.includes(shift.shiftName);
            return (
              <label
                key={shift.shiftName}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  checked
                    ? "border-black bg-gray-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleShift(shift.shiftName)}
                />
                <span>{shift.shiftName}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <Input
          label="Seat Number"
          name="seatNumber"
          type="number"
          value={form.seatNumber ?? ""}
          onChange={handleInputChange}
          min={1}
        />

        {seatStatus === "checking" && (
          <p className="mt-1 text-sm text-gray-500">Checking availability...</p>
        )}
        {seatStatus === "available" && (
          <p className="mt-1 text-sm text-green-600">
            Seat is available for selected shifts.
          </p>
        )}
        {seatStatus === "not_available" && (
          <p className="mt-1 text-sm text-red-600">
            Seat is already booked in an overlapping shift.
          </p>
        )}
      </div>

      <Input
        label="Start Date"
        name="startDate"
        type="date"
        value={form.startDate}
        onChange={handleInputChange}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Initial Payment"
          name="feesPaid"
          type="number"
          value={form.feesPaid}
          onChange={handleInputChange}
        />
        <Input
          label="Opening Pending"
          name="pendingFees"
          type="number"
          value={form.pendingFees}
          onChange={handleInputChange}
        />
      </div>

      {showPaymentMeta && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium">Payment Mode</label>
            <select
              name="paymentMode"
              value={form.paymentMode || "CASH"}
              onChange={handleInputChange}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black"
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="NETBANKING">Net Banking</option>
            </select>
          </div>

          {(form.paymentMode === "UPI" ||
            form.paymentMode === "CARD" ||
            form.paymentMode === "NETBANKING") && (
            <Input
              label="Transaction ID (Optional)"
              name="transactionId"
              value={form.transactionId || ""}
              onChange={handleInputChange}
            />
          )}

          <Input
            label="Payment Remarks (Optional)"
            name="paymentRemarks"
            value={form.paymentRemarks || ""}
            onChange={handleInputChange}
          />
        </>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading} disabled={seatStatus === "not_available"}>
          Save Student
        </Button>
      </div>
    </form>
  );
}
