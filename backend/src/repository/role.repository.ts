import { sequelize } from "@database/index";
import { RolePermissionModel } from "@model/role-permission.model";
import { RoleModel } from "@model/role.model";
import { IRole, IRolePermission, IRolePayload } from "@type/role.type";

class RoleRepository {
  async findAll(): Promise<IRole[]> {
    return await RoleModel.findAll({ order: [["createdAt", "ASC"]] });
  }

  async findOne(role: Partial<IRole>): Promise<IRolePayload | null> {
    return (await RoleModel.findOne({
      where: role,
      attributes: ["id", "name", "description", "priority"],
      include: [
        {
          model: RolePermissionModel,
          attributes: ["id", "idRole", "idPermission"],
        },
      ],
    })) as unknown as IRolePayload | null;
  }

  async create(role: IRolePayload): Promise<IRolePayload> {
    try {
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

        return { ...rsRole.dataValues, rolePermission: rsRolePermission };
      });
    } catch (e: any) {
      throw new Error(e.message || e);
    }
  }

  async update(role: IRolePayload): Promise<number> {
    try {
      return await sequelize.transaction(async () => {
        var a = 0;
        a += (
          await RoleModel.update(role, { where: { id: role.id } })
        ).flat()[0];
        a += await RolePermissionModel.destroy({
          where: { idRole: role.id },
        });

        const rolePermissionsToInsert = role.rolePermission.map((_a) => ({
          ..._a,
          idRole: role.id ?? "",
        }));

        a += (
          await RolePermissionModel.bulkCreate(rolePermissionsToInsert)
        ).flat().length;

        return a;
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export const roleRepository = new RoleRepository();
