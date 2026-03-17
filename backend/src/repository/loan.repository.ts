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
            type: true,
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
    return await prisma.$transaction(async (transaction) => {
      const ids = (
        await transaction.loanDetail.findMany({ where: { idLoan } })
      ).map((a) => a.idTool);

      const id = (
        await transaction.loan.update({
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

      await transaction.tool.updateMany({
        where: { id: { in: ids } },
        data: { available: !approved },
      });

      return id;
    });
  }

  async return(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    notes: string,
  ): Promise<string> {
    return prisma.$transaction(async (transaction) => {
      const ids = (
        await transaction.loanDetail.findMany({ where: { idLoan } })
      ).map((a) => a.idTool);

      const id = (
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
                type: "return",
              },
            },
          },
        })
      ).id;

      await transaction.tool.updateMany({
        where: { id: { in: ids } },
        data: { available: approved },
      });

      return id;
    });
  }

  async extend(
    idLoan: string,
    idUser: string,
    newReturnDate: Date,
    notes: string,
  ): Promise<string> {
    return (
      await prisma.loan.update({
        where: { id: idLoan },
        data: {
          returnDate: newReturnDate,
          loanApproves: {
            create: {
              idUser,
              approved: true,
              notes,
              type: "extension",
            },
          },
        },
      })
    ).id;
  }
}

export const loanRepository = new LoanRepository();
