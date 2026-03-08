import { model, models, Schema } from "mongoose";

export interface IEmailVerification {
  email: string;
  purpose: "REGISTER";
  otpHash: string;
  expiresAt: Date;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ["REGISTER"],
      required: true,
      default: "REGISTER",
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

EmailVerificationSchema.index(
  { email: 1, purpose: 1 },
  { unique: true }
);

const EmailVerification =
  models.EmailVerification ||
  model<IEmailVerification>(
    "EmailVerification",
    EmailVerificationSchema
  );

export default EmailVerification;
