import { RolePagePermissionModel } from "@model/role_page_permission.model";
import { IRolePagePermission } from "@type/role-page-permission.type";

class RolePagePermissionRepository {
  async create(
    rolePagePermission: IRolePagePermission
  ): Promise<IRolePagePermission> {
    return await RolePagePermissionModel.create(rolePagePermission);
  }

  async update(rolePagePermission: IRolePagePermission): Promise<number> {
    return (
      await RolePagePermissionModel.update(rolePagePermission, {
        where: { id: rolePagePermission.id },
      })
    ).flat()[0];
  }

  async delete(
    idPage: string,
    idPermission: string,
    idRole: string
  ): Promise<number> {
    return await RolePagePermissionModel.destroy({
      where: { idPage, idPermission, idRole },
    });
  }
}

export const rolePagePermissionRepository = new RolePagePermissionRepository();
