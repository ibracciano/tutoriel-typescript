// src/services/userService.ts
import User, { IUser } from "../models/User";

export const findUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id).select("-password -refreshToken"); // Exclure les champs sensibles
  return user;
};
