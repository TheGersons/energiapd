import { Mapper } from '@base/mapper';
import { LoanResponseEntity } from '../loan.entity';
import { LoanResponseModel } from '@domain/loan/loal.model';

export class LoansResponseMapper extends Mapper<
  LoanResponseEntity[],
  LoanResponseModel[]
> {
  override mapFrom(param: LoanResponseEntity[]): LoanResponseModel[] {
    return param.map((a) => ({
      loanId: a.id,
      loanName: a.name,
      loanApprovedBy: a.approvedBy,
      loanDeliveredBy: a.deliveredBy,
      loanDepartment: a.department,
      loanDni: a.dni,
      loanNotes: a.notes,
      loanReturnDate: a.returnDate,
      loanStatus: a.status,
      LoanUseDescription: a.useDescription,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: LoanResponseModel[]): LoanResponseEntity[] {
    return param.map((a) => ({
      id: a.loanId,
      name: a.loanName,
      approvedBy: a.loanApprovedBy,
      deliveredBy: a.loanDeliveredBy,
      department: a.loanDepartment,
      dni: a.loanDni,
      notes: a.loanNotes,
      returnDate: a.loanReturnDate,
      status: a.loanStatus,
      useDescription: a.LoanUseDescription,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }
}
