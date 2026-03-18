import { Mapper } from '@base/mapper';
import { ExitLoanModel } from '@domain/exitLoan/exitLoan.model';
import { ExitLoanEntity } from '../exitPass.entity';

export class ExitLoansMapper extends Mapper<ExitLoanEntity[], ExitLoanModel[]> {
  override mapFrom(param: ExitLoanEntity[]): ExitLoanModel[] {
    return param.map((a) => ({
      exitPassId: a.id,
      loanId: a.idLoan,
      exitPassType: a.type,
      createdAt: a.createdAt,
    }));
  }

  override mapTo(param: ExitLoanModel[]): ExitLoanEntity[] {
    return param.map((a) => ({
      id: a.loanId,
      idLoan: a.loanId,
      createdAt: a.createdAt,
      type: a.exitPassType,
    }));
  }
}
