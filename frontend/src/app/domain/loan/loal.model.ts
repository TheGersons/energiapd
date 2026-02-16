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

export interface LoanModelResponse {
  id: string;
  name: string;
  dni: string;
  department: string;
  useDescription: string;
  status: string;
  returnDate: string;
  approvedBy: string;
  deliveredBy: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
