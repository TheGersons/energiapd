import { ILoan, ILoanDTO, ILoanResponse } from "@type/loan.type";
import prisma from "@database/index";

class LoanRepository {
  async findAll(): Promise<ILoan[]> {
    return await prisma.loan.findMany({
      include: {
        department: true,
      },
    });
  }

  async findOne(tool: Partial<ILoan>): Promise<ILoanResponse | null> {
    const response = await prisma.loan.findUnique({
      where: { id: tool.id },
      include: {
        loanApproves: {
          select: {
            id: true,
            idLoan: true,
            idUser: true,
            approved: true,
          },
        },
        department: true,
        loanDetails: {
          include: {
            tool: true,
          },
        },
      },
    });

    if (!response) return null;

    const { loanDetails, ...loanData } = response;

    return {
      ...loanData,
      tool: response?.loanDetails.map((a) => a?.tool) ?? [],
    };
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

  async approval(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    notes: string,
  ): Promise<string> {
    return (
      await prisma.loan.update({
        where: {
          id: idLoan,
        },
        data: {
          status,
          loanApproves: {
            create: {
              idUser,
              approved,
              notes,
              type: "approval",
            },
          },
        },
      })
    ).id;
  }

  async delivery(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    notes: string,
  ): Promise<string> {
    return (
      await prisma.loan.update({
        where: {
          id: idLoan,
        },
        data: {
          status,
          loanApproves: {
            create: {
              idUser,
              approved,
              notes,
              type: "delivery",
            },
          },
        },
      })
    ).id;
  }
}

export const loanRepository = new LoanRepository();
