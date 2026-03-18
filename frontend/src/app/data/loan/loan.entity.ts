import { DepartmentEntity } from '@data/department/department.entity';
import { ToolEntity } from '@data/tool/tool.entity';

export interface LoanEntityDTO {
  name: string;
  dni: string;
  idDepartment: string;
  useDescription: string;
  status: string;
  returnDate: string;
  approvedBy: string;
  deliveredBy: string;
  notes: string;
  tools: Array<{ idTool: string }>;
}

export interface LoanEntity {
  id: string;
  name: string;
  dni: string;
  department: DepartmentEntity;
  useDescription: string;
  status: string;
  returnDate: string;
  deliveredBy: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanResponseEntity extends LoanEntity {
  loanApproves: Array<{
    id: string;
    idLoan: string;
    user: {
      id: string;
      fullname: string;
    };
    approved: boolean;
    type: 'approval' | 'delivery' | 'return' | 'extension';
    createdAt: string;
  }>;
  tool: ToolEntity[];
}
