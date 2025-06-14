import mongoose, { Document } from "mongoose";
import { thirthyDaysFromNow } from "../utils/date";

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  // pour connaitre l'appareil à partir duquel l'utilisateur se connecte
  userAgent?: string;
  createdAt: Date;
  expireAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  userAgent: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  expireAt: { type: Date, default: thirthyDaysFromNow },
});

const sessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);
export default sessionModel;
