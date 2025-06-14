import VerificationCodeType from "../constants/verificationCode";
import sessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import verificationCodeModel from "../models/VerificationCode.model";
import jwt from "jsonwebtoken";

import { oneYearFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET } from "../constants/env";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // verifier s'il existe
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("User already exist");
  }
  // creer l'utilisateur
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  //  creer un code de vérification
  const verificationCode = await verificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expireAt: oneYearFromNow(), // un jour
  });
  // creer un token
  // creer une session
  const session = await sessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });
  // envoyer un email

  // refresh et access token
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
      audience: ["user"],
    }
  );

  const accessToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: "15m",
    audience: ["user"],
  });

  // return user & tokens
  return { user, accessToken, refreshToken };
};
