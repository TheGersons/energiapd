import { sequelize } from "@database/index";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  sql,
} from "@sequelize/core";
import { LoanDetailModel } from "./loan-detail.model";

export class LoanModel extends Model<
  InferAttributes<LoanModel>,
  InferCreationAttributes<LoanModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare dni: string;
  declare department: string;
  declare useDescription: string;
  declare status: string;
  declare returnDate: Date;
  declare approvedBy: string;
  declare deliveredBy: string;
  declare notes: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare tools: NonAttribute<LoanDetailModel>;
}

LoanModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sql.uuidV4,
    },
    name: { type: DataTypes.STRING },
    dni: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    useDescription: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    returnDate: { type: DataTypes.DATE },
    approvedBy: { type: DataTypes.STRING },
    deliveredBy: { type: DataTypes.STRING },
    notes: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "loan",
    tableName: "tool_loan",
    timestamps: true,
  },
);
