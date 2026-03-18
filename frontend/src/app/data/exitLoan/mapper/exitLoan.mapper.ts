import { Mapper } from '@base/mapper';
import { ExitLoanEntity } from '../exitPass.entity';
import { ExitLoanModel } from '@domain/exitLoan/exitLoan.model';

export class ExitLoanMapper extends Mapper<ExitLoanEntity, ExitLoanModel> {
  override mapFrom(param: ExitLoanEntity): ExitLoanModel {
    return {
      exitPassId: param.id,
      loanId: param.idLoan,
      exitPassType: param.type,
      createdAt: param.createdAt,
    };
  }

  override mapTo(param: ExitLoanModel): ExitLoanEntity {
    return {
      id: param.exitPassId,
      idLoan: param.loanId,
      type: param.exitPassType,
      createdAt: param.createdAt,
    };
  }
}
