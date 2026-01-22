import { sequelize } from "@database/index";
import { RoleModel } from "@model/role.model";
import { RolePagePermissionModel } from "@model/role_page_permission.model";
import { IRole } from "@type/role.type";

class RoleRepository {
  async findAll(): Promise<IRole[]> {
    return await RoleModel.findAll({ order: [["createdAt", "ASC"]] });
  }

  async create(role: IRole): Promise<IRole> {
    return await RoleModel.create(role);
  }

  async update(role: IRole): Promise<number> {
    return (
      await RoleModel.update(role, {
        where: { id: role.id },
      })
    ).flat()[0];
  }

  async delete(roleId: string): Promise<number> {
    try {
      return await sequelize.transaction(async () => {
        await RolePagePermissionModel.destroy({ where: { idRole: roleId } });
        return await RoleModel.destroy({ where: { id: roleId } });
      });
    } catch (error) {
      return 0;
    }
    return await RoleModel.destroy({ where: { id: roleId } });
  }
}

export const roleRepository = new RoleRepository();
