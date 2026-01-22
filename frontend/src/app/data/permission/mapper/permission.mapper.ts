import { Mapper } from '@base/mapper';
import { callbackify } from 'util';
import { PermissionEntity } from '../permission.entity';
import { PermissionModel } from '@domain/permission/permission.model';

export class PermissionMapper extends Mapper<
  PermissionEntity[],
  PermissionModel[]
> {
  override mapFrom(param: PermissionEntity[]): PermissionModel[] {
    return param.map((a) => ({
      permissionId: a.id,
      permissionLabel: a.label,
      permissionName: a.name,
    }));
  }

  override mapTo(param: PermissionModel[]): PermissionEntity[] {
    return param.map((a) => ({
      id: a.permissionId,
      label: a.permissionLabel,
      name: a.permissionName,
    }));
  }
}
