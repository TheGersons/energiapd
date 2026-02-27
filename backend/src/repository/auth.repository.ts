import prisma from "@database/index";
import { compare } from "bcrypt";
import { buildFingerprint, signToken } from "session";
import { verify } from "jsonwebtoken";
import { Request } from "express";

class AuthRepository {
  async authenticate(login: string, password: string, req: Request) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            {
              nickname: login,
            },
            {
              email: login,
            },
          ],
        },
      });

      if (!user)
        throw { code: 401, message: "Usuario o contraseña incorrecta" };

      const validation = await compare(password, user.password);

      if (!validation)
        throw { code: 401, message: "Usuario o contraseña incorrecta" };

      await prisma.session.deleteMany({
        where: {
          idUser: user.id,
        },
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

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(accessToken: string, refreshToken: string, req: Request) {
    try {
      const rfToken = verify(
        refreshToken,
        process.env.SECRET_REFRESH as string,
      ) as any;

      const fingerprint = buildFingerprint(req);

      const session = await prisma.session.findFirst({
        where: {
          accessToken,
          refreshToken,
          fingerprint,
        },
      });

      if (!session) throw { code: 401, message: "Token no encontrado" };

      const newTK = signToken(
        rfToken.idUser,
        process.env.SECRET as string,
        "15m",
      );
      const newRTK = signToken(
        rfToken.idUser,
        process.env.SECRET_REFRESH as string,
        "8h",
      );

      await prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          accessToken: newTK,
          refreshToken: newRTK,
        },
      });
      return { accessToken: newTK, refreshToken: newRTK };
    } catch (error: any) {
      if (error.code) throw error;

      if (error.name === "TokenExpiredError")
        throw {
          code: 401,
          message: "Sesión expirada, por favor inicia sesión de nuevo",
        };

      if (error.name === "JsonWebTokenError")
        throw { code: 401, message: "Token inválido" };

      throw { code: 500, message: "Error interno en el proceso de refresco" };
    }
  }
}

export const authRepository = new AuthRepository();
