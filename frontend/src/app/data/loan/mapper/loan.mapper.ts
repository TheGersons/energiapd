import { Mapper } from '@base/mapper';
import { LoanEntity } from '../loan.entity';
import { LoanModel } from '@domain/loan/loal.model';

export class LoanMapper extends Mapper<LoanEntity, LoanModel> {
  override mapFrom(param: LoanEntity): LoanModel {
    return {
      loanId: param.id,
      loanName: param.name,
      loanDeliveredBy: param.deliveredBy,
      loanDepartment: {
        departmentId: param.department.id,
        departmentName: param.department.name,
        createdAt: param.department.createdAt,
        updatedAt: param.department.updatedAt,
      },
      loanDni: param.dni,
      loanNotes: param.notes,
      loanReturnDate: param.returnDate,
      loanStatus: param.status,
      LoanUseDescription: param.useDescription,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: LoanModel): LoanEntity {
    return {
      id: param.loanId,
      name: param.loanName,
      deliveredBy: param.loanDeliveredBy,
      department: {
        id: param.loanDepartment.departmentId,
        name: param.loanDepartment.departmentName,
        createdAt: param.loanDepartment.createdAt,
        updatedAt: param.loanDepartment.updatedAt,
      },
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
