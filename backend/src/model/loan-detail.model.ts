import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";
import { sequelize } from "@database/index";

export class LoanDetailModel extends Model<
  InferAttributes<LoanDetailModel>,
  InferCreationAttributes<LoanDetailModel>
> {
  declare id: CreationOptional<string>;
  declare idLoan: string;
  declare idTool: string;
}

LoanDetailModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sql.uuidV4,
    },
    idLoan: { type: DataTypes.STRING },
    idTool: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "loanDetail",
    tableName: "tool_loandetail",
    timestamps: false,
  },
);
