import { Mapper } from '@base/mapper';
import { LoanResponseEntity } from '../loan.entity';
import { LoanResponseModel } from '@domain/loan/loal.model';

export class LoanResponseMapper extends Mapper<
  LoanResponseEntity,
  LoanResponseModel
> {
  override mapFrom(param: LoanResponseEntity): LoanResponseModel {
    return {
      approves: param.loanApproves.map((a) => ({
        approveId: a.id,
        loanId: a.idLoan,
        state: a.approved,
        approveType: a.type,
        createdAt: a.createdAt,
        loanNewReturn: a.newReturnDate,
        approveUser: {
          userId: a.user.id,
          name: a.user.fullname,
        },
      })),
      tools: param.tool.map((a) => ({
        toolId: a.id,
        toolName: a.name,
        toolDescription: a.description,
        toolBrand: a.brand,
        toolModel: a.model,
        toolSerial: a.serial,
        toolImg: a.image,
        toolAvailable: a.available,
        toolCode: a.code,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      loanId: param.id,
      loanName: param.name,
      loanDni: param.dni,
      loanDepartment: {
        departmentId: param.department.id,
        departmentName: param.department.name,
        createdAt: param.department.createdAt,
        updatedAt: param.department.updatedAt,
      },
      LoanUseDescription: param.useDescription,
      loanStatus: param.status,
      loanReturnDate: param.returnDate,
      loanDeliveredBy: param.deliveredBy,
      loanNotes: param.notes,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: LoanResponseModel): LoanResponseEntity {
    return {
      loanApproves: param.approves.map((a) => ({
        id: a.approveId,
        idLoan: a.loanId,
        approved: a.state,
        type: a.approveType,
        createdAt: a.createdAt,
        newReturnDate: a.loanNewReturn,
        user: {
          id: a.approveUser.userId,
          fullname: a.approveUser.name,
        },
      })),
      tool: param.tools.map((a) => ({
        id: a.toolId,
        name: a.toolName,
        description: a.toolDescription,
        brand: a.toolBrand,
        model: a.toolModel,
        serial: a.toolSerial,
        image: a.toolImg,
        available: a.toolAvailable,
        code: a.toolCode,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      id: param.loanId,
      name: param.loanName,
      dni: param.loanDni,
      department: {
        id: param.loanDepartment.departmentId,
        name: param.loanDepartment.departmentName,
        createdAt: param.loanDepartment.createdAt,
        updatedAt: param.loanDepartment.updatedAt,
      },
      useDescription: param.LoanUseDescription,
      status: param.loanStatus,
      returnDate: param.loanReturnDate,
      deliveredBy: param.loanDeliveredBy,
      notes: param.loanNotes,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
