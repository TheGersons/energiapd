import { sequelize } from "@database/index";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";

export class LoanModel extends Model<
  InferAttributes<LoanModel>,
  InferCreationAttributes<LoanModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare dni: string;
  declare department: string;
  declare useDescription: string;
  declare status: number;
  declare useTime: Date;
  declare returnDate: Date;
  declare notes: string;
}

LoanModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: sql.uuidV4,
    },
    name: { type: DataTypes.STRING },
    dni: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    useDescription: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER },
    useTime: { type: DataTypes.DATE },
    returnDate: { type: DataTypes.DATE },
    notes: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Tool",
    tableName: "tool_loan_loan",
    timestamps: true,
  },
);
