import { Mapper } from '@base/mapper';
import { PlaneRoleEntity } from '../role.entity';
import { PlaneRoleModel } from '@domain/role/role.model';

export class PartialPlaneRoleMapper extends Mapper<
  Partial<PlaneRoleEntity>,
  Partial<PlaneRoleModel>
> {
  override mapFrom(param: Partial<PlaneRoleEntity>): Partial<PlaneRoleModel> {
    return {
      ...(param.id !== undefined && { roleId: param.id }),
      ...(param.name !== undefined && { roleName: param.name }),
      ...(param.description !== undefined && {
        roleDescription: param.description,
      }),
      ...(param.priority !== undefined && { rolePriority: param.priority }),
      ...(param.createdAt !== undefined && { createdAt: param.createdAt }),
      ...(param.updatedAt !== undefined && { updatedAt: param.updatedAt }),
    };
  }

  override mapTo(param: Partial<PlaneRoleModel>): Partial<PlaneRoleEntity> {
    return {
      ...(param.roleId !== undefined && { id: param.roleId }),
      ...(param.roleName !== undefined && { name: param.roleName }),
      ...(param.roleDescription !== undefined && {
        description: param.roleDescription,
      }),
      ...(param.rolePriority !== undefined && { priority: param.rolePriority }),
      ...(param.createdAt !== undefined && { createdAt: param.createdAt }),
      ...(param.updatedAt !== undefined && { updatedAt: param.updatedAt }),
    };
  }
}
