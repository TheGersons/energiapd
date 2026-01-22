import { LoanModel } from '@domain/loan/loal.model';
import { LoanEntity } from '../loan.entity';
import { Mapper } from '@base/mapper';

export class PartialLoanMapper extends Mapper<
  Partial<LoanEntity>,
  Partial<LoanModel>
> {
  override mapFrom(param: Partial<LoanEntity>): Partial<LoanModel> {
    return {
      ...(param.id !== undefined && { loanId: param.id }),
      ...(param.name !== undefined && { loanName: param.name }),
      ...(param.dni !== undefined && { loanDni: param.dni }),
      ...(param.department !== undefined && {
        loanDepartment: param.department,
      }),
      ...(param.useDescription !== undefined && {
        loanUseDescription: param.useDescription,
      }),
      ...(param.status !== undefined && { loanStatus: param.status }),
      ...(param.useTime !== undefined && { loanUseTime: param.useTime }),
      ...(param.returnDate !== undefined && {
        loanReturnDate: param.returnDate,
      }),
      ...(param.notes !== undefined && { loanNotes: param.notes }),
      ...(param.createdAt !== undefined && { loanCreatedAt: param.createdAt }),
      ...(param.updatedAt !== undefined && { loanUpdatedAt: param.updatedAt }),
    };
  }

  override mapTo(param: Partial<LoanModel>): Partial<LoanEntity> {
    return {
      ...(param.loanId !== undefined && { id: param.loanId }),
      ...(param.loanName !== undefined && { name: param.loanName }),
      ...(param.loanDni !== undefined && { dni: param.loanDni }),
      ...(param.loanDepartment !== undefined && {
        department: param.loanDepartment,
      }),
      ...(param.loanUseDescription !== undefined && {
        useDescription: param.loanUseDescription,
      }),
      ...(param.loanStatus !== undefined && { status: param.loanStatus }),
      ...(param.loanUseTime !== undefined && { useTime: param.loanUseTime }),
      ...(param.loanReturnDate !== undefined && {
        returnDate: param.loanReturnDate,
      }),
      ...(param.loanNotes !== undefined && { notes: param.loanNotes }),
    };
  }
}
