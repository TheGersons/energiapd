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
        const rsUser = await UserModel.create(user);

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

  async findOne(user: Partial<IUser>): Promise<IUserResponse | undefined> {
    const _a = await UserModel.findOne({
      where: { id: user.id },
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
    });

    if (!_a) {
      return undefined;
    }

    return {
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
    };
  }

  async update(user: IUserPayload): Promise<number> {
    try {
      return await sequelize.transaction(async () => {
        const rsUser = (
          await UserModel.update(user, { where: { id: user.id } })
        ).flat()[0];

        await UserRoleModel.destroy({ where: { idUser: user.id } });

        const rsUserRole = (await UserRoleModel.bulkCreate(user.roles)).length;

        return rsUser + rsUserRole;
      });
    } catch (e) {
      throw e;
    }
  }

  async activeCount(): Promise<number> {
    return await UserModel.count({ where: { status: true } });
  }

  async inactiveCount(): Promise<number> {
    return await UserModel.count({ where: { status: false } });
  }

  async totalCount(): Promise<number> {
    return await UserModel.count();
  }
}

export const userRepository = new UserRepository();
