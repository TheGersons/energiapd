import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class RolePagePermissionModel extends Model<
  InferAttributes<RolePagePermissionModel>,
  InferCreationAttributes<RolePagePermissionModel>
> {
  declare id: CreationOptional<string>;
  declare idRole: string;
  declare idPage: string;
  declare idPermission: string;
}

RolePagePermissionModel.init(
  {
    id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: sql.uuidV4 },
    idRole: { type: DataTypes.STRING },
    idPage: { type: DataTypes.STRING },
    idPermission: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "RolePagePermission",
    tableName: "role_page_permission",
    timestamps: false,
  }
);
