import { Request, Response } from "express";
import { authRepository } from "repository/auth.repository";
import { errorResponse } from "utils/errorResponse";

class AuthController {
  authenticate(req: Request, res: Response) {
    if (!req.ip) errorResponse(res, 400, "No se pudo leer la dirección IP");

    authRepository
      .authenticate(req.body.login, req.body.password)
      .then((rs) => {
        res
          .cookie("refreshToken", rs.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000,
            signed: true,
          })
          .cookie("accessToken", rs.accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
            signed: true,
          })
          .json("ok");
      })
      .catch((error) => {
        errorResponse(res, 500, "Error al autenticarse", error);
      });
  }

  refreshToken(req: Request, res: Response) {
    if (!req.signedCookies.accessToken)
      return errorResponse(res, 401, "No se pudo leer el token");

    if (!req.signedCookies.refreshToken)
      return errorResponse(res, 401, "No se pudo leer el refresh token");

    const { accessToken, refreshToken } = req.signedCookies;

    authRepository
      .refreshToken(accessToken, refreshToken)
      .then((rs) => {
        res
          .cookie("refreshToken", rs.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000,
            signed: true,
          })
          .cookie("accessToken", rs.accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
            signed: true,
          })
          .json("ok");
      })
      .catch((error) =>
        errorResponse(res, 500, "Error al refrescar el token", error),
      );
  }
}

export const authController = new AuthController();
