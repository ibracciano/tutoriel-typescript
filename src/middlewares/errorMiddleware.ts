import { NextFunction, Request, Response } from "express";
import Error from "../interface/error.interface";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.status || 500;
  const message = error.message || "Erreur interne du serveur";

  res.status(statusCode).json({ statusCode, message });
};

export default errorMiddleware;
