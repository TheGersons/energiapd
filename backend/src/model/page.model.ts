import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class PageModel extends Model<
  InferAttributes<PageModel>,
  InferCreationAttributes<PageModel>
> {
  declare id: CreationOptional<string>;
  declare idModule: string;
  declare name: string;
  declare label: string;
  declare url: string;
  declare description: string;
}

PageModel.init(
  {
    id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: sql.uuidV4 },
    idModule: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    label: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Page",
    tableName: "page",
    timestamps: false,
  }
);
