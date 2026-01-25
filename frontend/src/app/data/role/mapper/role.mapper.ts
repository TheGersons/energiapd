import { Mapper } from '@base/mapper';
import { RoleEntity } from '../role.entity';
import { RoleModel } from '@domain/role/role.model';

export class RoleMapper extends Mapper<RoleEntity, RoleModel> {
  override mapFrom(param: RoleEntity): RoleModel {
    return {
      roleId: param.id,
      roleName: param.name,
      roleDescription: param.description,
      rolePriority: param.priority,
      permission: param.rolePermission.map((a) => ({
        rolePermissionId: a.id,
        roleId: a.idRole,
        permissionId: a.idPermission,
      })),
    };
  }

  override mapTo(param: RoleModel): RoleEntity {
    return {
      id: param.roleId,
      name: param.roleName,
      description: param.roleDescription,
      priority: param.rolePriority,
      rolePermission: param.permission.map((a) => ({
        id: a.rolePermissionId,
        idRole: a.roleId,
        idPermission: a.permissionId,
      })),
    };
  }
}
