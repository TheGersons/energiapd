import { Mapper } from '@base/mapper';
import { LoanEntityDTO } from '../loan.entity';
import { LoanModelDTO } from '@domain/loan/loal.model';

export class LoanMapper extends Mapper<LoanEntityDTO, LoanModelDTO> {
  override mapFrom(param: LoanEntityDTO): LoanModelDTO {
    return {
      loanName: param.name,
      loanDni: param.dni,
      loanDepartment: param.department,
      loanUseDescription: param.useDescription,
      loanStatus: param.status,
      loanReturnDate: param.returnDate,
      loanNotes: param.notes,
      loanApprovedBy: param.approvedBy,
      loanDeliveredBy: param.deliveredBy,
      loanTools: param.tools.map((a) => ({
        toolId: a.idTool,
      })),
    };
  }

  override mapTo(param: LoanModelDTO): LoanEntityDTO {
    return {
      name: param.loanName,
      dni: param.loanDni,
      department: param.loanDepartment,
      useDescription: param.loanUseDescription,
      status: param.loanStatus,
      returnDate: param.loanReturnDate,
      notes: param.loanNotes,
      approvedBy: param.loanApprovedBy,
      deliveredBy: param.loanDeliveredBy,
      tools: param.loanTools.map((a) => ({
        idTool: a.toolId,
      })),
    };
  }
}
