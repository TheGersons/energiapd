import { sequelize } from "@database/index";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { PermissionModel } from "./permission.model";
import { RolePermissionModel } from "./role-permission.model";

export class RoleModel extends Model<
  InferAttributes<RoleModel>,
  InferCreationAttributes<RoleModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare priority: number;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: sql.uuidV4,
    },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    priority: { type: DataTypes.INTEGER },
  },
  { sequelize, modelName: "Role", tableName: "role", timestamps: true },
);

RoleModel.hasMany(RolePermissionModel, {
  foreignKey: "idRole",
  sourceKey: "id",
  as: "rolePermission",
});
