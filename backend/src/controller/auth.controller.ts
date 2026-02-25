import { Request, Response } from "express";
import { authRepository } from "repository/auth.repository";
import { errorResponse } from "utils/errorResponse";

class AuthController {
  authenticate(req: Request, res: Response) {
    if (!req.ip) errorResponse(res, 400, "No se pudo leer la dirección IP");

    authRepository
      .authenticate(req.body.login, req.body.password, req.ip ?? "")
      .then((rs) => {
        res
          .cookie("refreshToken", rs.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000,
            signed: true
          })
          .json(rs.token);
      })
      .catch((error) => {
        errorResponse(res, 500, "Error al autenticarse", error);
      });
  }
}

export const authController = new AuthController();
