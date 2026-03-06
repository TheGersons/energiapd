import { Request, Response } from "express";
import { authRepository } from "repository/auth.repository";
import { errorResponse } from "utils/errorResponse";

class AuthController {
  authenticate(req: Request, res: Response) {
    if (!req.ip) errorResponse(res, 400, "No se pudo leer la dirección IP");

    authRepository
      .authenticate(req.body.login, req.body.password, req)
      .then((rs) => {
        res
          .cookie("refreshToken", rs.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 8 * 60 * 60 * 1000,
            signed: true,
          })
          .cookie("accessToken", rs.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            signed: true,
          })
          .json("ok");
      })
      .catch((error: any) => {
        errorResponse(res, error.code, error.message);
      });
  }

  refreshToken(req: Request, res: Response) {
    if (!req.signedCookies.refreshToken)
      return errorResponse(res, 401, "No se pudo leer el refresh token");

    const { refreshToken } = req.signedCookies;

    authRepository
      .refreshToken(refreshToken, req)
      .then((rs) => {
        res
          .cookie("refreshToken", rs.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 8 * 60 * 60 * 1000,
            signed: true,
          })
          .cookie("accessToken", rs.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            signed: true,
          })
          .json("ok");
      })
      .catch((error) => {
        errorResponse(res, 500, "Error al refrescar el token", error);
      });
  }
}

export const authController = new AuthController();
