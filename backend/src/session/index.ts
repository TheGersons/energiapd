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
  try {
    const accessToken = req.signedCookies.accessToken;
    const payload: any = verify(accessToken, process.env.SECRET as string);

    const rsToken = await prisma.session.findFirst({
      where: { accessToken, idUser: payload.idUser },
    });

    if (!(payload && rsToken))
      return errorResponse(res, 401, "Token no registrado");

    (req as any).idUser = (payload as any).idUser;
    next();
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError")
      return errorResponse(res, 401, "Token expirado", error);

    return errorResponse(res, 401, "Token inválido", error);
  }
};

export const saveToken = () => {};
