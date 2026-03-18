import prisma from "@database/index";
import { IExitLoan } from "@type/exitLoan.type";

class ExitLoanRepository {
  async register(idLoan: string): Promise<IExitLoan> {
    const last = await prisma.loanPass.findFirst({
      where: { idLoan },
      orderBy: {
        createdAt: "desc",
      },
    });

    const nextType = !last || last.type === "ingreso" ? "salida" : "ingreso";

    const log = await prisma.loanPass.create({
      data: { idLoan, type: nextType },
    });

    return log;
  }

  async findByLoan(where: Partial<IExitLoan>): Promise<IExitLoan[]> {
    if (!where.idLoan) return [];
    return prisma.loanPass.findMany({
      where: { idLoan: where.idLoan },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const exitLoanRepository = new ExitLoanRepository();
