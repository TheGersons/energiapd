import { ILoan, ILoanDTO } from "@type/loan.type";
import { LoanModel } from "@model/loan.model";
import { sequelize } from "@database/index";
import { LoanDetailModel } from "@model/loan-detail.model";
import { ILoanDetail } from "@type/loan-detail.type";

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

  async create(loan: ILoanDTO): Promise<string> {
    return await sequelize.transaction(async () => {
      const loanResponse = await LoanModel.create(loan);

      const loanDetail: ILoanDetail[] = loan.tools.map((a) => ({
        ...a,
        idLoan: loanResponse.id,
      }));

      await LoanDetailModel.bulkCreate(loanDetail);

      return loanResponse.id;
    });
  }
}

export const loanRepository = new LoanRepository();
