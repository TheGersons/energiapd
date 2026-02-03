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
import { UserModel } from "./user.model";
import { RoleModel } from "./role.model";
import { IRole } from "@type/role.type";

export class UserRoleModel extends Model<
  InferAttributes<UserRoleModel>,
  InferCreationAttributes<UserRoleModel>
> {
  declare id: CreationOptional<string>;
  declare idUser: string;
  declare idRole: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare role: NonAttribute<IRole>;
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

UserRoleModel.belongsTo(RoleModel, {
  foreignKey: "idRole",
  targetKey: "id",
  as: "role",
});
