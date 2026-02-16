import { ILoanDetail } from "./loan-detail.type";

export interface ILoan {
  id?: string;
  name: string;
  dni: string;
  department: string;
  useDescription: string;
  status: string;
  returnDate: Date;
  approvedBy: string;
  deliveredBy: string;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoanDTO {
  name: string;
  dni: string;
  department: string;
  useDescription: string;
  status: string;
  returnDate: Date;
  approvedBy: string;
  deliveredBy: string;
  notes: string;
  tools: ILoanDetail[];
}

export interface ILoanResponse {

}
