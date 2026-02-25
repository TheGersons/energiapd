import prisma from "@database/index";
import { compare } from "bcrypt";
import { permissionRepository } from "./permission.repository";
import { signToken } from "session";

class AuthRepository {
  async authenticate(login: string, password: string, ip: string) {
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

      const token = signToken(user.id, process.env.SECRET as string, "15m");

      const refreshToken = signToken(
        user.id,
        process.env.SECRET_REFRESH as string,
        "8h",
      );

      await prisma.session.create({
        data: { idUser: user.id, ip, token },
      });

      return { token, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  veri
}

export const authRepository = new AuthRepository();
