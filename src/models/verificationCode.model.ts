import mongoose, { Document } from "mongoose";
import VerificationCodeType from "../constants/verificationCode";

export interface VerificationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: VerificationCodeType;
  expireAt: Date;
  createdAt: Date;
}

const verifcationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

const verificationCodeModel = mongoose.model<VerificationCodeDocument>(
  "VerificationCode",
  verifcationCodeSchema,
  "verification_codes"
);

export default verificationCodeModel;
