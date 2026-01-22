import { IPermission } from "@type/permission.type";
import { sequelize } from "@database/index";
import { RoleModel } from "@model/role.model";
import { PageModel } from "@model/page.model";
import { PermissionModel } from "@model/permission.model";

class PermissionRepository {
  async findAll(): Promise<IPermission | any> {
    return await PermissionModel.findAll();
  }

  async findPermissionsByRole(id: string) {
    return await RoleModel.findOne({
      where: { id },
      attributes: ["id"],
      include: [
        {
          model: PageModel,
          as: "rolePage",
          attributes: ["id", "idModule"],
          through: { attributes: [] },
          include: [
            {
              model: PermissionModel,
              as: "pagePermission",
              attributes: ["name"],
              through: { attributes: [], where: { idRole: id } },
            },
          ],
        },
      ],
    });
  }
}

export const permissionRepository = new PermissionRepository();
