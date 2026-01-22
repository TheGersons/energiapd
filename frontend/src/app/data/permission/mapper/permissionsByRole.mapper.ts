import { Mapper } from '@base/mapper';
import { PermissionsByRoleEntity } from '../permission.entity';
import { PermissionsByRoleModel } from '@domain/permission/permission.model';

export class PermissionByRoleMapper extends Mapper<
  PermissionsByRoleEntity,
  PermissionsByRoleModel
> {
  override mapFrom(param: PermissionsByRoleEntity): PermissionsByRoleModel {
    return {
      roleId: param.id,
      page: param.rolePage.map((a) => ({
        pageId: a.id,
        moduleId: a.idModule,
        permission: a.pagePermission,
      })),
    };
  }

  override mapTo(param: PermissionsByRoleModel): PermissionsByRoleEntity {
    return {
      id: param.roleId,
      rolePage: param.page.map((a) => ({
        id: a.pageId,
        idModule: a.moduleId,
        pagePermission: a.permission,
      })),
    };
  }
}
