import prisma from "@database/index";
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

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    return errorResponse(res, 401, "No autorizado, no cuentas con el token");
  }

  const { authorization, "user-agent": userAgent } = req.headers;
  const ip = req.ip;

  const token = authorization.split(" ")[1] ?? "";

  try {
    const payload = verify(token, process.env.SECRET as string);

    const rsToken = await prisma.session.findFirst({
      where: { token: token, userAgent, ip },
    });

    if (!(payload && rsToken))
      return errorResponse(res, 403, "Token no registrado");

    (req as any).idUser = (payload as any).idUser;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError")
      return errorResponse(res, 401, "Token expirado");

    return errorResponse(res, 403, "Token inválido");
  }
};

export const saveToken = () => {};
