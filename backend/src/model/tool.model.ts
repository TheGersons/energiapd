import { sequelize } from "@database/index";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";

export class ToolModel extends Model<
  InferAttributes<ToolModel>,
  InferCreationAttributes<ToolModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare brand: string;
  declare model: string;
  declare serial: string;
  declare image: string;
  declare available: boolean;
  declare code: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ToolModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: sql.uuidV4,
    },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    brand: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
    serial: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    code: { type: DataTypes.BOOLEAN },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "tool",
    tableName: "tool",
    timestamps: true,
  },
);
