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
