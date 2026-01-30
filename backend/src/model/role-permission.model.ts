import { sequelize } from "@database/index";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";

export class RolePermissionModel extends Model<
  InferAttributes<RolePermissionModel>,
  InferCreationAttributes<RolePermissionModel>
> {
  declare id: CreationOptional<string>;
  declare idRole: string;
  declare idPermission: string;
}

RolePermissionModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: sql.uuidV4,
    },
    idRole: { type: DataTypes.UUIDV4 },
    idPermission: { type: DataTypes.UUIDV4 },
  },
  {
    sequelize,
    modelName: "RolePermission",
    tableName: "role_permission",
    timestamps: true,
  },
);
