import { Mapper } from '@base/mapper';
import { LoanEntity } from '../loan.entity';
import { LoanModel } from '@domain/loan/loal.model';

export class LoanMapper extends Mapper<LoanEntity, LoanModel> {
  override mapFrom(param: LoanEntity): LoanModel {
    return {
      loanId: param.id,
      loanName: param.name,
      loanDni: param.dni,
      loanDepartment: param.department,
      loanUseDescription: param.useDescription,
      loanStatus: param.status,
      loanUseTime: param.useTime,
      loanReturnDate: param.returnDate,
      loanNotes: param.notes,
      loanCreatedAt: param.createdAt,
      loanUpdatedAt: param.updatedAt,
    };
  }

  override mapTo(param: LoanModel): LoanEntity {
    return {
      id: param.loanId,
      name: param.loanName,
      dni: param.loanDni,
      department: param.loanDepartment,
      useDescription: param.loanUseDescription,
      status: param.loanStatus,
      useTime: param.loanUseTime,
      returnDate: param.loanReturnDate,
      notes: param.loanNotes,
    };
  }
}
