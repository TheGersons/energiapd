import { Mapper } from '@base/mapper';
import { LoanEntity } from '../loan.entity';
import { LoanModel } from '@domain/loan/loal.model';

export class LoansMapper extends Mapper<LoanEntity[], LoanModel[]> {
  override mapFrom(param: LoanEntity[]): LoanModel[] {
    return param.map((a) => ({
      loanId: a.id,
      loanName: a.name,
      loanDni: a.dni,
      loanDepartment: a.department,
      loanUseDescription: a.useDescription,
      loanStatus: a.status,
      loanUseTime: a.useTime,
      loanReturnDate: a.returnDate,
      loanNotes: a.notes,
      loanCreatedAt: a.createdAt,
      loanUpdatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: LoanModel[]): LoanEntity[] {
    return param.map((a) => ({
      id: a.loanId,
      name: a.loanName,
      dni: a.loanDni,
      department: a.loanDepartment,
      useDescription: a.loanUseDescription,
      status: a.loanStatus,
      useTime: a.loanUseTime,
      returnDate: a.loanReturnDate,
      notes: a.loanNotes,
    }));
  }
}
