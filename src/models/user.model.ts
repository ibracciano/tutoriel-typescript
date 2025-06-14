import mongoose from "mongoose";
import { handleCompareValue, handleHashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// methode pour hacher le mot de passe avant enregistrement
userSchema.pre("save", async function (next) {
  // verifier d'abord si le mot de passe n'a pas été modifié
  // si non, pas de hachage
  if (!this.isModified("password")) {
    return next();
  }
  // hacher le mot de passe
  this.password = await handleHashValue(this.password, 10);
  next();
});

// methode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (val: string) {
  handleCompareValue(val, this.password);
};

// le modèle
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
