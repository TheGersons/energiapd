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
import { RoleModel } from "./role.model";
import { UserRoleModel } from "./user_role.model";

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<string>;
  declare fullname: string;
  declare nickname: string;
  declare email: string;
  declare password: string;
  declare status: boolean;
  declare requestChangePass: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare roles?: NonAttribute<UserRoleModel[]>;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: sql.uuidV4,
    },
    fullname: { type: DataTypes.STRING },
    nickname: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    idRole: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    requestChangePass: { type: DataTypes.BOOLEAN },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
  },
  { sequelize, modelName: "User", tableName: "user", timestamps: true },
);

UserModel.hasMany(UserRoleModel, {
  foreignKey: "idUser",
  sourceKey: "id",
  as: "roles",
});
