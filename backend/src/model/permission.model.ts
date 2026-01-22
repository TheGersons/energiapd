import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class PermissionModel extends Model<
  InferAttributes<PermissionModel>,
  InferCreationAttributes<PermissionModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare label: string;
}

PermissionModel.init(
  {
    id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: sql.uuidV4 },
    name: { type: DataTypes.STRING },
    label: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Permission",
    tableName: "permission",
    timestamps: false
  }
);
