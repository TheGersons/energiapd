import { sequelize } from "@database/index";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  sql,
} from "@sequelize/core";

export class UserRoleModel extends Model<
  InferAttributes<UserRoleModel>,
  InferCreationAttributes<UserRoleModel>
> {
  declare id: CreationOptional<string>;
  declare idUser: string;
  declare idRole: string;
}

UserRoleModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: sql.uuidV4,
    },
    idUser: { type: DataTypes.UUIDV4 },
    idRole: { type: DataTypes.UUIDV4 },
  },
  {
    sequelize,
    modelName: "UserRole",
    tableName: "user_role",
    timestamps: true,
  },
);
