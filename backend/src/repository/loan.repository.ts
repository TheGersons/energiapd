import { ILoan, ILoanDTO } from "@type/loan.type";
import prisma from "@database/index";

class LoanRepository {
  async findAll(): Promise<ILoan[]> {
    return await prisma.loan.findMany();
  }

  async findOne(tool: Partial<ILoan>): Promise<ILoan | null> {
    return await prisma.loan.findUnique({ where: { id: tool.id } });
  }

  async update(loan: ILoan): Promise<number> {
    return (
      await prisma.loan.updateMany({ data: loan, where: { id: loan.id } })
    ).count;
  }

  async create(loan: ILoanDTO): Promise<string> {
    const { tools, ...loanDTO } = loan;

    return (
      await prisma.loan.create({
        data: {
          ...loanDTO,
          loanDetails: {
            createMany: { data: tools },
          },
        },
      })
    ).id;
  }
}

export const loanRepository = new LoanRepository();
