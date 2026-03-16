import { Mapper } from '@base/mapper';
import { LoanEntity } from '../loan.entity';
import { LoanModel } from '@domain/loan/loal.model';

export class LoansMapper extends Mapper<LoanEntity[], LoanModel[]> {
  override mapFrom(param: LoanEntity[]): LoanModel[] {
    return param.map((a) => ({
      loanId: a.id,
      loanName: a.name,
      loanDeliveredBy: a.deliveredBy,
      loanDepartment: {
        departmentId: a.department.id,
        departmentName: a.department.name,
        createdAt: a.department.createdAt,
        updatedAt: a.department.updatedAt,
      },
      loanDni: a.dni,
      loanNotes: a.notes,
      loanReturnDate: a.returnDate,
      loanStatus: a.status,
      LoanUseDescription: a.useDescription,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: LoanModel[]): LoanEntity[] {
    return param.map((a) => ({
      id: a.loanId,
      name: a.loanName,
      deliveredBy: a.loanDeliveredBy,
      department: {
        id: a.loanDepartment.departmentId,
        name: a.loanDepartment.departmentName,
        createdAt: a.loanDepartment.createdAt,
        updatedAt: a.loanDepartment.updatedAt,
      },
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
