export interface LoanEntityDTO {
  name: string;
  dni: string;
  department: string;
  useDescription: string;
  status: string;
  returnDate: string;
  approvedBy: string;
  deliveredBy: string;
  notes: string;
  tools: Array<{ idTool: string }>;
}

export interface LoanResponseEntity {
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
