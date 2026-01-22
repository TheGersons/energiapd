import { Mapper } from '@base/mapper';
import { RoleEntity } from '../role.entity';
import { RoleModel } from '@domain/role/role.model';

export class RolesMapper extends Mapper<RoleEntity[], RoleModel[]> {
  override mapFrom(param: RoleEntity[]): RoleModel[] {
    return param.map((a) => ({
      roleId: a.id,
      roleName: a.name,
      roleDescription: a.description,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: RoleModel[]): RoleEntity[] {
    return param.map((a) => ({
      id: a.roleId,
      name: a.roleName,
      description: a.roleDescription,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }
}
