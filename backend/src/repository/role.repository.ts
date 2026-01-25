import { sequelize } from "@database/index";
import { RolePermissionModel } from "@model/role-permission.module";
import { RoleModel } from "@model/role.model";
import { IRole, IRolePermission, IRolePayload } from "@type/role.type";

class RoleRepository {
  async findAll(): Promise<IRole[]> {
    return await RoleModel.findAll({ order: [["createdAt", "ASC"]] });
  }

  async create(role: IRolePayload): Promise<IRolePayload> {
    try {
      console.log(role.rolePermission);
      return await sequelize.transaction(async () => {
        const rsRole = await RoleModel.create({
          name: role.name,
          description: role.description,
          priority: Number(role.priority) || 0,
        });

        const rolePermissionsToInsert = role.rolePermission.map((rp) => ({
          ...rp,
          idRole: rsRole.id,
        }));

        const rsRolePermission = await RolePermissionModel.bulkCreate(
          rolePermissionsToInsert,
        );

        return { ...rsRole, rolePermission: rsRolePermission };
      });
    } catch (e: any) {
      throw new Error(e.message || e);
    }
  }
}

export const roleRepository = new RoleRepository();
