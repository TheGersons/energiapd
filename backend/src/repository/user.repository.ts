import { sequelize } from "@database/index";
import { RoleModel } from "@model/role.model";
import { UserModel } from "@model/user.model";
import { UserRoleModel } from "@model/user_role.model";
import { IUserRole } from "@type/user-role.type";
import { IUser, IUserPayload, IUserResponse } from "@type/user.type";

class UserRepository {
  async findAll(): Promise<IUser[]> {
    return (
      await UserModel.findAll({
        attributes: [
          "id",
          "fullname",
          "nickname",
          "email",
          "status",
          "createdAt",
          "updatedAt",
        ],
        include: {
          model: RoleModel,
        },
      })
    ).map((_a) => ({
      id: _a.id,
      fullname: _a.fullname,
      nickname: _a.nickname,
      email: _a.email,
      status: _a.status,
      requestChangePass: _a.requestChangePass,
      createdAt: _a.createdAt?.toISOString(),
      updatedAt: _a.updatedAt?.toISOString(),
    }));
  }

  async create(user: IUserPayload): Promise<IUserResponse> {
    try {
      return await sequelize.transaction(async () => {
        const rsUser = await UserModel.create({
          fullname: user.fullname,
          nickname: user.nickname,
          email: user.email,
          password: user.password,
          requestChangePass: user.requestChangePass,
          status: true,
        });

        const rolesToInsert: IUserRole[] = user.roles.map((_a) => ({
          ..._a,
          idUser: rsUser.id,
        }));

        const rsUserRole = await UserRoleModel.bulkCreate(rolesToInsert);
        return {
          id: rsUser.id,
          fullname: rsUser.fullname,
          nickname: rsUser.nickname,
          email: rsUser.email,
          status: rsUser.status,
          requestChangePass: rsUser.requestChangePass,
          createdAt: rsUser.createdAt?.toISOString(),
          updatedAt: rsUser.updatedAt?.toISOString(),
          roles: rsUserRole,
        };
      });
    } catch (e) {
      throw e;
    }
  }
}

export const userRepository = new UserRepository();
