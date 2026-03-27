import { Request, Response } from "express";
import { authRepository } from "repository/auth.repository";
import { errorResponse } from "utils/errorResponse";

class AuthController {
  private getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  };

  authenticate = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.ip) {
        errorResponse(res, 400, "No se pudo leer la dirección IP");
        return;
      }

      const rs = await authRepository.authenticate(
        req.body.login,
        req.body.password,
        req,
      );

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
        .status(200)
        .json({ idUser: rs.idUser, requestChangePass: rs.requestChangePass });
    } catch (error: any) {
      const status = error?.code || 500;
      errorResponse(res, status, this.getErrorMessage(error));
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.signedCookies?.refreshToken) {
        errorResponse(res, 401, "No se pudo leer el refresh token");
        return;
      }

      const { refreshToken } = req.signedCookies;
      const rs = await authRepository.refreshToken(refreshToken, req);

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
        .status(200)
        .json("ok");
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al refrescar el token",
        this.getErrorMessage(error),
      );
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      if (!req.signedCookies?.accessToken) {
        errorResponse(res, 401, "No se pudo leer el refresh token");
        return;
      }

      if (!("idUser" in req)) {
        errorResponse(res, 401, "No se pudo leer el idUsuario");
        return;
      }

      const { accessToken } = req.signedCookies;

      const rs = await authRepository.logout((req as any).idUser, accessToken);
      if (rs < 1) {
        errorResponse(res, 404, "Usuario o sesión no encontrada.");
        return;
      }

      res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al cerrar la sesión.",
        this.getErrorMessage(error),
      );
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorResponse(res, 400, "Correo electrónico no válido.");
        return;
      }
      await authRepository.forgotPassword(email);
      res.status(200).json({
        ok: true,
      });
    } catch (error) {
      res.status(200).json({
        ok: true,
      });
    }
  };
}

export const authController = new AuthController();
