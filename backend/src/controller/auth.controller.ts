import { Request, Response } from "express";
import { authRepository } from "repository/auth.repository";
import { errorResponse } from "utils/errorResponse";

class AuthController {
  authenticate(req: Request, res: Response) {
    if (!req.ip) errorResponse(res, 400, "No se pudo leer la dirección IP");

    authRepository
      .authenticate(
        req.body.login,
        req.body.password,
        req.ip ?? "",
        req.headers["user-agent"] ?? "",
      )
      .then((rs) => {
        res
          .cookie("refreshToken", rs.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000,
            signed: true,
          })
          .json(rs.token);
      })
      .catch((error) => {
        errorResponse(res, 500, "Error al autenticarse", error);
      });
  }

  refreshToken(req: Request, res: Response) {
    if (!req.ip)
      return errorResponse(res, 400, "No se pudo leer la dirección IP");

    if (!req.headers.authorization)
      return errorResponse(res, 401, "No se pudo leer el token");

    if (!req.signedCookies.refreshToken)
      return errorResponse(res, 401, "No se pudo leer el refresh token");

    if (!req.headers["user-agent"])
      return errorResponse(res, 400, "No se pudo leer el agente");

    const { authorization, "user-agent": userAgent } = req.headers;
    const ip = req.ip;
    const refreshToken = req.signedCookies.refreshToken;

    const token = authorization.split(" ")[1];

    authRepository
      .refreshToken(req.ip, userAgent, token, refreshToken)
      .then((rs) => {
        res
          .cookie("refreshToken", rs.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000,
            signed: true,
          })
          .json(rs.token);
      })
      .catch((error) =>
        errorResponse(res, 500, "Error al refrescar el token", error),
      );
  }
}

export const authController = new AuthController();
