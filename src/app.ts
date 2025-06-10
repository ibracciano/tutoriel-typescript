// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

// Charger les variables d'environnement
dotenv.config();

// les importations
import connectDB from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middlewares/errorMiddleware";
import { OK } from "./constants/http";
import authRoute from "./routes/auth.route";

const app: Application = express();

// Middlewares

app.use(express.json()); // Permet à Express de parser le JSON des requêtes
app.use(express.urlencoded({ extended: true })); // Permet de parser les données encodées par URL
app.use(cookieParser()); // Pour parser les cookies
app.use(morgan("common"));
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: "Trop de requêtes entrantes, attendre dans 15 minutes",
  })
);
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoute);

// Route de test
app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  try {
    // throw new Error("Il y a erreur");
    res.status(OK).json({ message: "Bienvenue sur mon application" });
  } catch (error) {
    next(error);
  }
});

// Middlewares de gestion d'erreurs (doivent être après toutes les routes)
app.use(errorHandler);

app.listen(PORT, async () => {
  // Connecter à la base de données
  connectDB();
  console.log(`Serveur demarre en mode ${NODE_ENV} au port ${PORT}`);
});
