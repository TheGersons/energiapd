import { sequelize } from "@database/index";
import { RoleModel } from "@model/role.model";
import { UserModel } from "@model/user.model";
import { UserRoleModel } from "@model/user_role.model";
import { IUserRole } from "@type/user-role.type";
import { IUser, IUserPayload, IUserResponse } from "@type/user.type";

class UserRepository {
  async findAll(): Promise<IUserResponse[]> {
    return (
      await UserModel.findAll({
        attributes: [
          "id",
          "nickname",
          "email",
          "fullname",
          "status",
          "requestChangePass",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: UserRoleModel,
            as: "roles",
            attributes: ["id"],
            include: [
              {
                model: RoleModel,
                as: "role",
                attributes: ["id", "name", "description", "priority"],
              },
            ],
          },
        ],
      })
    ).map((_a) => ({
      id: _a.id,
      nickname: _a.nickname,
      email: _a.email,
      fullname: _a.fullname,
      status: _a.status,
      requestChangePass: _a.requestChangePass,
      roles:
        _a.roles?.map((_b) => ({
          id: _b.role.id,
          name: _b.role.name,
          description: _b.role.description,
          priority: _b.role.priority,
        })) ?? [],
      createdAt: _a.createdAt,
      updatedAt: _a.updatedAt,
    }));
  }

  async create(user: IUserPayload): Promise<{ id: string }> {
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

        await UserRoleModel.bulkCreate(rolesToInsert);
        return { id: rsUser.id };
      });
    } catch (e) {
      throw e;
    }
  }
}

export const userRepository = new UserRepository();
