import { sequelize } from "@database/index";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";

export class RoleModel extends Model<
  InferAttributes<RoleModel>,
  InferCreationAttributes<RoleModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
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
  },
  { sequelize, modelName: "Role", tableName: "role", timestamps: true }
);
