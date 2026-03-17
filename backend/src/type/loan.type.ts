import { IDepartment } from "./department.type";
import { ILoanDetail } from "./loan-detail.type";
import { ITool } from "./tool.type";

export interface ILoan {
  id?: string;
  name: string;
  dni: string;
  department: IDepartment;
  useDescription: string;
  status: string;
  returnDate: Date;
  approvedBy: string;
  deliveredBy: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoanDTO {
  name: string;
  dni: string;
  idDepartment: string;
  useDescription: string;
  status: string;
  returnDate: Date;
  approvedBy: string;
  deliveredBy: string;
  notes: string;
  tools: ILoanDetail[];
}

export interface ILoanResponse {
  id: string;
  name: string;
  dni: string;
  department: IDepartment;
  tool: ITool[];
  useDescription: string;
  status: string;
  returnDate: Date;
  loanApproves: Array<{
    id: string;
    idLoan: string;
    idUser: string;
    approved: boolean;
    type: string;
  }>;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
