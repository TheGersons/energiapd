import { ILoan } from "@type/loan.type";
import { LoanModel } from "@model/loan.model";

class LoanRepository {
  async findAll(): Promise<ILoan[]> {
    return await LoanModel.findAll();
  }

  async findOne(tool: Partial<ILoan>): Promise<ILoan | null> {
    return await LoanModel.findOne({ where: tool });
  }

  async update(loan: ILoan): Promise<number> {
    return (await LoanModel.update(loan, { where: { id: loan.id } })).flat()[0];
  }

  async create(loan: ILoan): Promise<ILoan> {
    return await LoanModel.create(loan);
  }
}

export const loanRepository = new LoanRepository();
