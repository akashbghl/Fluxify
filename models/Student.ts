import mongoose, { Schema, models, model } from "mongoose";
import { normalizeStudentShiftNames } from "@/lib/studentShift";

export interface IStudent {
  name: string;
  email?: string;
  phone: string;
  plan: "1_MONTH" | "3_MONTH" | "6_MONTH" | "12_MONTH";
  shiftName?: string;
  shiftNames?: string[];
  seatNumber: number;               
  startDate: Date;
  expiryDate: Date;
  feesPaid: number;
  pendingFees: number;
  status: "ACTIVE" | "EXPIRED";
  organizationId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    plan: {
      type: String,
      enum: ["1_MONTH", "3_MONTH", "6_MONTH", "12_MONTH"],
      required: true,
    },
    shiftName: {
      type: String,
      required: true,
      trim: true,
    },
    shiftNames: {
      type: [String],
      default: [],
      validate: [
        (val: string[]) => Array.isArray(val) && val.length > 0,
        "At least one shift is required",
      ],
    },

    seatNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },

    feesPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    pendingFees: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED"],
      default: "ACTIVE",
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Auto update status before saving
 */
StudentSchema.pre("validate", function () {
  const normalizedShiftNames = normalizeStudentShiftNames({
    shiftName: this.shiftName,
    shiftNames: this.shiftNames,
  });

  this.shiftNames = normalizedShiftNames;
  this.shiftName = normalizedShiftNames[0] || "";
});

StudentSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate() as Record<string, unknown> | undefined;
  if (!update) return;

  const setPayload =
    typeof update.$set === "object" && update.$set
      ? (update.$set as Record<string, unknown>)
      : (update as Record<string, unknown>);

  const normalizedShiftNames = normalizeStudentShiftNames({
    shiftName:
      typeof setPayload.shiftName === "string"
        ? setPayload.shiftName
        : undefined,
    shiftNames: Array.isArray(setPayload.shiftNames)
      ? (setPayload.shiftNames as string[])
      : undefined,
  });

  if (normalizedShiftNames.length > 0) {
    setPayload.shiftNames = normalizedShiftNames;
    setPayload.shiftName = normalizedShiftNames[0];
  }

  if (update.$set) {
    update.$set = setPayload;
  } else {
    Object.assign(update, setPayload);
  }

  this.setUpdate(update);
});

StudentSchema.pre("save", function () {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (this.expiryDate < today) {
    this.status = "EXPIRED";
  } else {
    this.status = "ACTIVE";
  }
});

/* ======================================================
   Prevent Duplicate Seat Booking
   ====================================================== */

StudentSchema.index(
  {
    organizationId: 1,
    shiftName: 1,
    seatNumber: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: "ACTIVE" },
  }
);

const Student =
  models.Student || model<IStudent>("Student", StudentSchema);

export default Student;
