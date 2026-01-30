import { Mapper } from '@base/mapper';
import { PlaneRoleEntity, RoleEntity } from '../role.entity';
import { PlaneRoleModel, RoleModel } from '@domain/role/role.model';

export class PlaneRolesMapper extends Mapper<
  PlaneRoleEntity[],
  PlaneRoleModel[]
> {
  override mapFrom(param: PlaneRoleEntity[]): PlaneRoleModel[] {
    return param.map((a) => ({
      roleId: a.id,
      roleName: a.name,
      roleDescription: a.description,
      rolePriority: a.priority,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: PlaneRoleModel[]): PlaneRoleEntity[] {
    return param.map((a) => ({
      id: a.roleId,
      name: a.roleName,
      description: a.roleDescription,
      priority: a.rolePriority,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }
}
