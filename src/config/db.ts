// src/config/db.ts
import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI as string);
    console.log(`Base de données connectée: ${conn.connection.host}`);
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Arrête l'application en cas d'échec de connexion à la DB
  }
};

export default connectDB;
