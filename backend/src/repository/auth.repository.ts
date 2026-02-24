import prisma from "@database/index";
import { compareSync } from "bcrypt";

class AuthRepository {
  async authenticate(login: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { OR: [{ nickname: login }, { email: login }] },
    });
  }
}
