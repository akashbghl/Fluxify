import mongoose, { Schema, model, models } from "mongoose";

export interface IPayment {
  student: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  amount: number;
  mode: "CASH" | "UPI" | "CARD" | "NETBANKING";
  status: "SUCCESS" | "PENDING" | "FAILED";
  transactionId?: string;
  remarks?: string;
  paidAt: Date;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    // Immutable snapshot for audit trail even if student is deleted later
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    studentPhone: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    mode: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "NETBANKING"],
      required: true,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "PENDING", "FAILED"],
      default: "SUCCESS",
    },
    transactionId: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({
  organizationId: 1,
  paidAt: -1,
});

PaymentSchema.index({
  student: 1,
  paidAt: -1,
});

const Payment =
  models.Payment || model<IPayment>("Payment", PaymentSchema);

export default Payment;

