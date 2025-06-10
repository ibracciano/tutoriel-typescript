// src/app.ts
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

// Charger les variables d'environnement
dotenv.config();

// Connecter à la base de données
connectDB();

const app = express();

// Middlewares
app.use(express.json()); // Permet à Express de parser le JSON des requêtes
app.use(express.urlencoded({ extended: true })); // Permet de parser les données encodées par URL
app.use(cookieParser()); // Pour parser les cookies

// Routes

// Route de test
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Middlewares de gestion d'erreurs (doivent être après toutes les routes)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
