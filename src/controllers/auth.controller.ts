import { z } from "zod";
import catchErros from "../utils/catchError";
import { createAccount } from "../services/auth.service";
import { setAuthCookies } from "../utils/cookies";
import { CREATED } from "../constants/http";

const registerSchema = z
  .object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const registerController = catchErros(async (req, res) => {
  // validation
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  // service
  const { user, accessToken, refreshToken } = await createAccount(request);
  // return
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});
