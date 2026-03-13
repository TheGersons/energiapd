import { Mapper } from '@base/mapper';
import { DepartmentEntity } from '../department.entity';
import { DepartmentModel } from '@domain/department/department.model';

export class DepartmentMapper extends Mapper<
  DepartmentEntity,
  DepartmentModel
> {
  override mapFrom(param: DepartmentEntity): DepartmentModel {
    return {
      departmentId: param.id,
      departmentName: param.name,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: DepartmentModel): DepartmentEntity {
    return {
      id: param.departmentId,
      name: param.departmentName,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
