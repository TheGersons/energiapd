import prisma from "@database/index";
import { NextFunction, Request, Response } from "express";
import { sign, verify, SignOptions } from "jsonwebtoken";
import { errorResponse } from "utils/errorResponse";
import { createHash } from "crypto";

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
    const fingerprint = buildFingerprint(req);

    const rsToken = await prisma.session.findFirst({
      where: { accessToken, idUser: payload.idUser, fingerprint },
    });

    if (!(payload && rsToken))
      return errorResponse(res, 401, "Token no registrado");

    (req as any).idUser = (payload as any).idUser;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError")
      return errorResponse(res, 403, "Token expirado", error);

    if (error.name === "JsonWebTokenError")
      return errorResponse(res, 401, "No existe el token", error);

    return errorResponse(res, 401, "Token inválido", error);
  }
};

export const buildFingerprint = (req: Request): string => {
  const deviceId = req.headers["x-device-id"] as string;

  if (!deviceId) return "";

  return createHash("sha256").update(deviceId).digest("hex");
};
