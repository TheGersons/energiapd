import {
  CreationOptional,
  DataType,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class ModuleModel extends Model<
  InferAttributes<ModuleModel>,
  InferCreationAttributes<ModuleModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare label: string;
}

ModuleModel.init(
  {
    id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: sql.uuidV4 },
    name: { type: DataTypes.STRING },
    label: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Module",
    tableName: "module",
    timestamps: false,
  }
);
