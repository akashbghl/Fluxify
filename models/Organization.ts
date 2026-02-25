import mongoose, { Schema, model, models } from "mongoose";

export interface IOrganization {
  name: string;
  slug: string; // unique public identifier
  email?: string;
  phone?: string;
  logo?: string;
  plan?: string;
  isActive: boolean;
  isConfigured?: boolean;
  seatConfig?: ISeatConfig;
  createdAt: Date;
}

export interface IShift {
  shiftName: string;
  totalSeats: number;
  startTime?: string;
  endTime?: string;
}

export interface ISeatConfig {
  totalSeats: number;
  shifts: IShift[];
}
// shift schema
const ShiftSchema = new Schema<IShift>(
  {
    shiftName: {
      type: String,
      required: true,
      trim: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    startTime: {
      type: String,
      required: false,
      validate: {
        validator: function (val: string) {
          return !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);
        },
        message: "Invalid startTime format (HH:mm required)",
      },
    },

    endTime: {
      type: String,
      required: false,
      validate: {
        validator: function (val: string) {
          return !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);
        },
        message: "Invalid endTime format (HH:mm required)",
      },
    },
  },
  { _id: false }
);

const SeatConfigSchema = new Schema<ISeatConfig>(
  {
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    shifts: {
      type: [ShiftSchema],
      required: true,
      validate: [(val: IShift[]) => val.length > 0, "At least one shift required"],
    },

  },
  { _id: false }
);

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: String,
    phone: String,

    logo: {
      type: String,
      default: "",
    },
    plan: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      default: "FREE",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isConfigured: {
      type: Boolean,
      default: false,
    },

    seatConfig: {
      type: SeatConfigSchema,
      default: null,
    },
  },
  { timestamps: true }
);


const Organization =
  models.Organization ||
  model<IOrganization>(
    "Organization",
    OrganizationSchema
  );

export default Organization;
