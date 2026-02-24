import mongoose, { Schema, model, models } from "mongoose";

export interface IOrganization {
  name: string;
  slug: string; // unique public identifier
  email?: string;
  phone?: string;
  logo?: string;
  plan?: string;
  isActive: boolean;
  createdAt: Date;
}

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
