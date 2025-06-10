// src/config/db.ts
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Arrête l'application en cas d'échec de connexion à la DB
  }
};

export default connectDB;
