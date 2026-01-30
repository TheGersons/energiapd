import { Mapper } from '@base/mapper';
import { PlaneRoleEntity } from '../role.entity';
import { PlaneRoleModel } from '@domain/role/role.model';

export class PlaneRoleMapper extends Mapper<PlaneRoleEntity, PlaneRoleModel> {
  override mapFrom(param: PlaneRoleEntity): PlaneRoleModel {
    return {
      roleId: param.id,
      roleName: param.name,
      roleDescription: param.description,
      rolePriority: param.priority,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: PlaneRoleModel): PlaneRoleEntity {
    return {
      id: param.roleId,
      name: param.roleName,
      description: param.roleDescription,
      priority: param.rolePriority,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
