// src/app.ts
import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// les importations
import connectDB from "./config/db";

// Charger les variables d'environnement
dotenv.config();

// Connecter à la base de données
connectDB();

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
    message: "Trop de requêtes entrante, attendre dans 15 minutes",
  })
);

// Routes

// Route de test
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Bienvenue sur mon application" });
});

// Middlewares de gestion d'erreurs (doivent être après toutes les routes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
