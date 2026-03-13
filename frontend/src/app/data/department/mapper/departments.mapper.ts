import { Mapper } from '@base/mapper';
import { DepartmentEntity } from '../department.entity';
import { DepartmentModel } from '@domain/department/department.model';

export class DepartmentsMapper extends Mapper<
  DepartmentEntity[],
  DepartmentModel[]
> {
  override mapFrom(param: DepartmentEntity[]): DepartmentModel[] {
    return param.map((a) => ({
      departmentId: a.id,
      departmentName: a.name,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: DepartmentModel[]): DepartmentEntity[] {
    return param.map((a) => ({
      id: a.departmentId,
      name: a.departmentName,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }
}
