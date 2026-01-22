import { Mapper } from '@base/mapper';
import { RolePagePermissionEntity } from '../permission.entity';
import { RolePagePermissionModel } from '@domain/permission/permission.model';

export class RolePagePermissionMapper extends Mapper<
  RolePagePermissionEntity,
  RolePagePermissionModel
> {
  override mapFrom(param: RolePagePermissionEntity): RolePagePermissionModel {
    return {
      rolePagePermissionId: param.id,
      roleId: param.idRole,
      pageId: param.idPage,
      permissionId: param.idPermission,
    };
  }

  override mapTo(param: RolePagePermissionModel): RolePagePermissionEntity {
    return {
      id: param.rolePagePermissionId,
      idRole: param.roleId,
      idPage: param.pageId,
      idPermission: param.permissionId,
    };
  }
}
