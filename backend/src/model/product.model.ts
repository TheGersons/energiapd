import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class ProductModel extends Model<
  InferAttributes<ProductModel>,
  InferCreationAttributes<ProductModel>
> {
  declare id: CreationOptional<number>;
  declare sku: string;
  declare name: string;
  declare basePrice: number;
  declare category: number;
  declare brand: string;
  declare shortDescription: string;
  declare variants: boolean;
  declare publicMarket: boolean;
}

ProductModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sku: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    basePrice: { type: DataTypes.FLOAT },
    category: { type: DataTypes.INTEGER },
    brand: { type: DataTypes.STRING },
    shortDescription: { type: DataTypes.STRING },
    variants: { type: DataTypes.BOOLEAN },
    publicMarket: { type: DataTypes.BOOLEAN },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "product",
    timestamps: true,
  }
);
