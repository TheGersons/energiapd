import { Mapper } from '@base/mapper';
import { LoanResponseEntity } from '../loan.entity';
import { LoanResponseModel } from '@domain/loan/loal.model';

export class LoanResponseMapper extends Mapper<
  LoanResponseEntity,
  LoanResponseModel
> {
  override mapFrom(param: LoanResponseEntity): LoanResponseModel {
    return {
      loanId: param.id,
      loanName: param.name,
      loanApprovedBy: param.approvedBy,
      loanDeliveredBy: param.deliveredBy,
      loanDepartment: param.department,
      loanDni: param.dni,
      loanNotes: param.notes,
      loanReturnDate: param.returnDate,
      loanStatus: param.status,
      LoanUseDescription: param.useDescription,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: LoanResponseModel): LoanResponseEntity {
    return {
      id: param.loanId,
      name: param.loanName,
      approvedBy: param.loanApprovedBy,
      deliveredBy: param.loanDeliveredBy,
      department: param.loanDepartment,
      dni: param.loanDni,
      notes: param.loanNotes,
      returnDate: param.loanReturnDate,
      status: param.loanStatus,
      useDescription: param.LoanUseDescription,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
