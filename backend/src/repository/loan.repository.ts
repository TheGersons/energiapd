import { ILoan, ILoanDTO, ILoanResponse } from "@type/loan.type";
import prisma from "@database/index";

class LoanRepository {
  /**
   * Obtiene todos los préstamos incluyendo el departamento asociado.
   */
  async findAll(): Promise<ILoan[]> {
    return await prisma.loan.findMany({
      include: {
        department: true,
      },
    });
  }

  /**
   * Busca un préstamo detallado.
   * Transforma la estructura de loanDetails para retornar una lista plana de herramientas.
   */
  async findOne(where: Partial<ILoan>): Promise<ILoanResponse | null> {
    if (!where.id) return null;

    const response = await prisma.loan.findUnique({
      where: { id: where.id },
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
      tool: loanDetails.map((detail) => detail.tool),
    };
  }

  /**
   * Actualiza los datos generales de un préstamo.
   */
  async update(loan: ILoan): Promise<number> {
    const { id, ...data } = loan;
    const rs = await prisma.loan.updateMany({
      data,
      where: { id },
    });
    return rs.count;
  }

  /**
   * Crea un préstamo y sus detalles (herramientas asociadas) en una sola operación.
   */
  async create(loan: ILoanDTO): Promise<string> {
    const { tools, ...loanDTO } = loan;

    const rs = await prisma.loan.create({
      data: {
        ...loanDTO,
        loanDetails: {
          createMany: { data: tools },
        },
      },
    });
    return rs.id;
  }

  /**
   * Registra la aprobación de un préstamo.
   */
  async approval(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    notes: string,
  ): Promise<string> {
    const rs = await prisma.loan.update({
      where: { id: idLoan },
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
    });
    return rs.id;
  }

  /**
   * Procesa la entrega física. Usa una transacción para actualizar el estado de las herramientas.
   */
  async delivery(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    notes: string,
  ): Promise<string> {
    return await prisma.$transaction(async (tx) => {
      const details = await tx.loanDetail.findMany({
        where: { idLoan },
        select: { idTool: true },
      });
      const toolIds = details.map((d) => d.idTool);

      const loanUpdate = await tx.loan.update({
        where: { id: idLoan },
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
      });

      await tx.tool.updateMany({
        where: { id: { in: toolIds } },
        data: { available: !approved },
      });

      return loanUpdate.id;
    });
  }

  /**
   * Procesa la devolución. Las herramientas vuelven a estar disponibles.
   */
  async return(
    idLoan: string,
    idUser: string,
    approved: boolean,
    status: string,
    notes: string,
  ): Promise<string> {
    return await prisma.$transaction(async (tx) => {
      const details = await tx.loanDetail.findMany({
        where: { idLoan },
        select: { idTool: true },
      });
      const toolIds = details.map((d) => d.idTool);

      const loanUpdate = await tx.loan.update({
        where: { id: idLoan },
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
      });

      await tx.tool.updateMany({
        where: { id: { in: toolIds } },
        data: { available: approved },
      });

      return loanUpdate.id;
    });
  }

  /**
   * Extiende la fecha de retorno de un préstamo.
   */
  async extend(
    idLoan: string,
    idUser: string,
    newReturnDate: Date,
    notes: string,
  ): Promise<string> {
    const rs = await prisma.loan.update({
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
    });
    return rs.id;
  }
}

export const loanRepository = new LoanRepository();
