import { Mapper } from '@base/mapper';
import { callbackify } from 'util';
import { PermissionEntity } from '../permission.entity';
import { PermissionModel } from '@domain/permission/permission.model';

export class PermissionsMapper extends Mapper<
  PermissionEntity[],
  PermissionModel[]
> {
  override mapFrom(param: PermissionEntity[]): PermissionModel[] {
    return param.map((a) => ({
      permissionId: a.id,
      nameModule: a.moduleName,
      pages: a.page.map((p) => ({
        pageId: p.id,
        pageName: p.name,
        permissions: p.permission.map((perm) => ({
          permissionId: perm.id,
          permissionLabel: perm.label,
          value: perm.slug,
        })),
      })),
    }));
  }

  override mapTo(param: PermissionModel[]): PermissionEntity[] {
    return param.map((a) => ({
      id: a.permissionId,
      moduleName: a.nameModule,
      page: a.pages.map((p) => ({
        id: p.pageId,
        name: p.pageName,
        permission: p.permissions.map((perm) => ({
          id: perm.permissionId,
          label: perm.permissionLabel,
          slug: perm.value,
        })),
      })),
    }));
  }
}
