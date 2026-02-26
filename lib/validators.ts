import { z } from "zod";

/* ============================
   AUTH VALIDATIONS
============================ */

export const registerSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ chars"),
  role: z.enum(["SUPER_ADMIN", "MANAGER", "STAFF"]).optional(),
  organizationName: z.string().min(3, "Organization name too short"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/* ============================
   STUDENT VALIDATIONS
============================ */

export const studentCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  plan: z.enum(["1_MONTH", "3_MONTH", "6_MONTH", "12_MONTH"]),
  shiftName: z.string().min(1),
  seatNumber: z.coerce.number().int().positive(),
  startDate: z.string(), // ISO date
  feesPaid: z.number().min(0),
  pendingFees: z.number().min(0).optional(),
});

export const studentUpdateSchema = studentCreateSchema.partial();

/* ============================
   PAYMENT VALIDATIONS
============================ */

export const paymentSchema = z.object({
  studentId: z.string().min(1),
  amount: z.number().positive(),
  mode: z.enum(["CASH", "UPI", "CARD", "NETBANKING"]),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

/* ============================
   HELPERS
============================ */

/**
 * Safe validation wrapper
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}
