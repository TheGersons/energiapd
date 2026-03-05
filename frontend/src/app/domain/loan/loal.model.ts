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

export interface LoanResponseModel {
  loanId: string;
  loanName: string;
  loanDni: string;
  loanDepartment: string;
  LoanUseDescription: string;
  loanStatus: string;
  loanReturnDate: string;
  loanApprovedBy: string;
  loanDeliveredBy: string;
  loanNotes: string;
  createdAt: string;
  updatedAt: string;
}
