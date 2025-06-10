import dotenv from "dotenv";
dotenv.config();

type Environment = "development" | "staging" | "production";

// configuration de l'authentication
interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  cookieDomain?: string;
  secureCookies: boolean;
  refreshTokenExpiresIn: string;
}

// configuration de la base de données
interface DbConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
}

// configuration de l'application
interface AppConfig {
  env: Environment;
  port: number;
  debug: boolean;
  db: DbConfig;
  auth: AuthConfig;
}

const getConfig = (): AppConfig => ({
  env: (process.env.NODE_ENV as Environment) || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  debug: process.env.DEBUG === "true",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "27017",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "auth_dev",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "secret_key",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    cookieDomain: process.env.COOKIE_DOMAIN,
    secureCookies: process.env.SECURE_COOKIES === "true",
  },
});

const config = getConfig();
export default config;
