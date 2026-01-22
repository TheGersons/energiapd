import { Mapper } from '@base/mapper';
import { RoleEntity } from '../role.entity';
import { RoleModel } from '@domain/role/role.model';

export class RoleMapper extends Mapper<RoleEntity, RoleModel> {
  override mapFrom(param: RoleEntity): RoleModel {
    return {
      roleId: param.id,
      roleName: param.name,
      roleDescription: param.description,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: RoleModel): RoleEntity {
    return {
      id: param.roleId,
      name: param.roleName,
      description: param.roleDescription,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
