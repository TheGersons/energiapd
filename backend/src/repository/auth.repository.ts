import prisma from "@database/index";
import { compare, hash } from "bcrypt";
import { buildFingerprint, signToken } from "session";
import { verify } from "jsonwebtoken";
import { Request } from "express";
import { mailService } from "@mail/mail.service";
import { randomBytes, randomInt } from "crypto";
import { resetPasswordTemplate } from "@mail/resetPassword.mail";

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

  async logout(idUser: string, accessToken: string): Promise<number> {
    return (
      await prisma.session.deleteMany({
        where: {
          idUser,
          accessToken,
        },
      })
    ).count;
  }

  async forgotPassword(email: string) {
    const rs = await prisma.user.findUnique({ where: { email } });

    if (!rs) return;

    const pass = this.generateSecurePassword(8);

    await prisma.user.update({
      where: { email },
      data: { requestChangePass: true, password: await hash(pass, 10) },
    });

    await mailService.send({
      to: email,
      attachments: undefined,
      subject: "Restablece tu contraseña",
      html: resetPasswordTemplate(rs.fullname, pass),
    });
  }

  generateSecurePassword(length: number = 12): string {
    // Forzamos mínimo 8 para que quepan todos los tipos
    const finalLength = length < 8 ? 8 : length;

    const sets = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      number: "0123456789",
      special: "!@#$*", // Caracteres seguros para emails y bases de datos
    };

    const allChars = Object.values(sets).join("");
    let password: string[] = [];

    // 1. Aseguramos al menos uno de cada uno (Requisito estricto)
    password.push(sets.upper[randomInt(sets.upper.length)]);
    password.push(sets.number[randomInt(sets.number.length)]);
    password.push(sets.special[randomInt(sets.special.length)]);
    password.push(sets.lower[randomInt(sets.lower.length)]);

    // 2. Rellenamos el resto hasta llegar al length deseado
    for (let i = password.length; i < finalLength; i++) {
      password.push(allChars[randomInt(allChars.length)]);
    }

    // 3. Mezclamos (Shuffle) usando Fisher-Yates para evitar patrones
    for (let i = password.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join("");
  }
}

export const authRepository = new AuthRepository();
