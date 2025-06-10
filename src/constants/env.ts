import dotenv from "dotenv";
dotenv.config();

// fonction pour obtenir les variables d'environnement
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  // console.log(value);

  if (value === undefined) {
    throw new Error(`La variable d'environnement: ${key}, n'est pas définie`);
  }

  return value;
};

export const MONGO_URI = getEnv("MONGO_URI");
export const PORT = getEnv("PORT", "5000");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_EXPIRES_IN = getEnv("JWT_EXPIRES_IN");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const JWT_REFRESH_EXPIRES_IN = getEnv("JWT_REFRESH_EXPIRES_IN");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
