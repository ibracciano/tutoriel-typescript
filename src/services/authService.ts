import { refreshToken } from "./../controllers/authController";
import { refreshToken } from "./authService";
// src/services/authService.ts
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import {
  generateToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyToken,
} from "../utils/jwt";
import { Response } from "express";

interface AuthResponse {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (
  username: string,
  email: string,
  passwordInput: string
): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error("User with that email or username already exists");
  }

  const user: IUser = await User.create({
    username,
    email,
    password: passwordInput,
  });

  const accessToken = generateToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString());

  // Hacher le refresh token avant de le stocker dans la DB
  const salt = await bcrypt.genSalt(10);
  user.refreshToken = await bcrypt.hash(refreshToken, salt);
  await user.save();

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    accessToken,
  };
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (
  usernameOrEmail: string,
  passwordInput: string
): Promise<AuthResponse> => {
  const user: IUser = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  }).select("+password +refreshToken"); // Sélectionnez le mot de passe et le refresh token pour la vérification

  if (!user || !(await user.matchPassword(passwordInput))) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString());

  // Mettre à jour et hacher le nouveau refresh token
  const salt = await bcrypt.genSalt(10);
  user.refreshToken = await bcrypt.hash(refreshToken, salt);
  await user.save();

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    accessToken,
  };
};

/**
 * Déconnexion (supprime le refresh token de la DB)
 */
export const logout = async (userId: string) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = undefined; // Supprime le refresh token
    await user.save();
  }
};

/**
 * Rafraîchissement du token d'accès
 */
export const refreshToken = async (token: string): Promise<AuthResponse> => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  const decoded = (await verifyToken(
    token,
    process.env.JWT_REFRESH_SECRET
  )) as { id: string };

  const user: IUser = await User.findById(decoded.id).select("+refreshToken");
  if (
    !user ||
    !user.refreshToken ||
    !(await bcrypt.compare(token, user.refreshToken))
  ) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateToken(user._id.toString(), user.email);
  // Optionnel: Générer un nouveau refresh token à chaque fois pour rotation
  // const newRefreshToken = generateRefreshToken(user._id.toString());
  // const salt = await bcrypt.genSalt(10);
  // user.refreshToken = await bcrypt.hash(newRefreshToken, salt);
  // await user.save();

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    accessToken,
  };
};

export { setAuthCookies, clearAuthCookies };
