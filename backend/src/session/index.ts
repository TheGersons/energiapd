import { NextFunction, Request, Response } from "express";
import { sign, verify, SignOptions } from "jsonwebtoken";
import { errorResponse } from "utils/errorResponse";

export const signToken = (
  idUser: string,
  secret: string,
  expiration: string,
) => {
  return sign({ idUser }, secret, {
    expiresIn: expiration as SignOptions["expiresIn"],
  });
};

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return errorResponse(res, 403, "No autorizado, no cuentas con el token");
  }

  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1] ?? "";

  try {
    const payload = verify(token, process.env.SECRET as string);
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.cookies.refreshToken;

      
    }
    return errorResponse(res, 403, "Token inválido o expirado");
  }
};

export const saveToken = () => {};
