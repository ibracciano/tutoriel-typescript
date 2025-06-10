// cette fonction prend en parametre une fonction asynchrone(=controller)
// et retourne l'erreur capturé

import { NextFunction, Request, Response } from "express";

type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const catchErros = (controller: AsyncControllerType): AsyncControllerType => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default catchErros;
