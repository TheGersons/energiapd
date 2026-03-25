import prisma from "@database/index";
import { compare } from "bcrypt";
import { buildFingerprint, signToken } from "session";
import { verify } from "jsonwebtoken";
import { Request } from "express";

class AuthRepository {
  /**
   * Autentica un usuario y genera una nueva sesión.
   */
  async authenticate(login: string, password: string, req: Request) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ nickname: login }, { email: login }],
        },
      });

      if (!user) {
        throw { code: 401, message: "Usuario o contraseña incorrecta" };
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw { code: 401, message: "Usuario o contraseña incorrecta" };
      }

      await prisma.session.deleteMany({
        where: { idUser: user.id },
      });

      const accessToken = signToken(
        user.id,
        process.env.SECRET as string,
        "15m",
      );

      const refreshToken = signToken(
        user.id,
        process.env.SECRET_REFRESH as string,
        "8h",
      );

      const fingerprint = buildFingerprint(req);

      await prisma.session.create({
        data: {
          idUser: user.id,
          accessToken,
          refreshToken,
          fingerprint,
        },
      });

      return {
        accessToken,
        refreshToken,
        idUser: user.id,
        requestChangePass: user.requestChangePass,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresca los tokens de acceso basándose en un Refresh Token válido y la huella digital.
   */
  async refreshToken(refreshToken: string, req: Request) {
    try {
      const decoded = verify(
        refreshToken,
        process.env.SECRET_REFRESH as string,
      ) as { idUser: string };

      const fingerprint = buildFingerprint(req);
      const session = await prisma.session.findFirst({
        where: {
          refreshToken,
          fingerprint,
        },
      });

      if (!session) {
        throw { code: 401, message: "Token no encontrado o sesión inválida" };
      }

      const newTK = signToken(
        decoded.idUser,
        process.env.SECRET as string,
        "15m",
      );

      const newRTK = signToken(
        decoded.idUser,
        process.env.SECRET_REFRESH as string,
        "8h",
      );

      await prisma.session.update({
        where: { id: session.id },
        data: {
          accessToken: newTK,
          refreshToken: newRTK,
        },
      });

      return { accessToken: newTK, refreshToken: newRTK };
    } catch (error: any) {
      if (error.code) throw error;

      if (error.name === "TokenExpiredError") {
        throw {
          code: 401,
          message: "Sesión expirada, por favor inicia sesión de nuevo",
        };
      }

      if (error.name === "JsonWebTokenError") {
        throw { code: 401, message: "Token inválido" };
      }

      throw { code: 500, message: "Error interno en el proceso de refresco" };
    }
  }
}

export const authRepository = new AuthRepository();
