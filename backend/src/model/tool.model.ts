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
  declare status: boolean;
  declare img: string;
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
    status: { type: DataTypes.BOOLEAN },
    img: { type: DataTypes.STRING },
  },
  { sequelize, modelName: "Tool", tableName: "tool_loan_tool", timestamps: true }
);
