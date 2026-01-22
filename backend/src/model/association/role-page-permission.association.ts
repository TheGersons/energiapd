import { PageModel } from "@model/page.model";
import { PermissionModel } from "@model/permission.model";
import { RoleModel } from "@model/role.model";
import { RolePagePermissionModel } from "@model/role_page_permission.model";

// Un rol tiene muchos permisos a través de las páginas
RoleModel.belongsToMany(PageModel, {
  through: { model: RolePagePermissionModel, unique: false },
  foreignKey: "idRole",
  otherKey: "idPage",
  as: "rolePage",
});

PageModel.belongsToMany(PermissionModel, {
  through: { model: RolePagePermissionModel, unique: false },
  foreignKey: "idPage",
  otherKey: "idPermission",
  as: "pagePermission",
});
