import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";

const handleZodError = (res: Response, error: z.ZodError) => {
  // res.status();
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  res.status(BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`PATH: ${req.path},`, error); // test

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  res.status(INTERNAL_SERVER_ERROR).send("Erreur interne du serveur");
};

export default errorHandler;
