import { DepartmentModel } from '@domain/department/department.model';
import { ToolModel } from '@domain/tool/tool.model';

export interface LoanModelDTO {
  loanName: string;
  loanDni: string;
  loanDepartment: string;
  loanUseDescription: string;
  loanStatus: string;
  loanReturnDate: string;
  loanApprovedBy: string;
  loanDeliveredBy: string;
  loanNotes: string;
  loanTools: Array<{ toolId: string }>;
}

export interface LoanFormModel {
  loanName: string;
  loanDni: string;
  loanDepartment: string;
  loanUseDescription: string;
  loanReturnDate: string;
  loanNotes: string;
}

export interface LoanModel {
  loanId: string;
  loanName: string;
  loanDni: string;
  loanDepartment: DepartmentModel;
  LoanUseDescription: string;
  loanStatus: string;
  loanReturnDate: string;
  loanDeliveredBy: string;
  loanNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanResponseModel extends LoanModel {
  approves: Array<{
    approveId: string;
    loanId: string;
    userId: string;
    state: boolean;
  }>;
  tools: ToolModel[];
}
