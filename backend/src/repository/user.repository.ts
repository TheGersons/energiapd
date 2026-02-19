import { sequelize } from "@database/index";
import { PermissionModel } from "@model/permission.model";
import { RolePermissionModel } from "@model/role-permission.model";
import { RoleModel } from "@model/role.model";
import { UserModel } from "@model/user.model";
import { UserRoleModel } from "@model/user_role.model";
import { IRole } from "@type/role.type";
import { IUserRole } from "@type/user-role.type";
import { IUser, IUserPayload, IUserResponse } from "@type/user.type";
import { hashSync } from "bcrypt";

class UserRepository {
  async findAll(): Promise<IUserResponse[]> {
    const users = await UserModel.findAll({
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
          model: RoleModel,
          through: { attributes: [] },
          attributes: ["id", "name", "description", "priority"],
        },
      ],
    });

    return users.map((_a: UserModel) => ({
      id: _a.id,
      nickname: _a.nickname,
      email: _a.email,
      fullname: _a.fullname,
      status: _a.status,
      requestChangePass: _a.requestChangePass,
      roles: (_a["user-role"] ?? []).map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        priority: role.priority,
      })),
      createdAt: _a.createdAt,
      updatedAt: _a.updatedAt,
    }));
  }

  async create(user: IUserPayload): Promise<{ id: string }> {
    try {
      return await sequelize.transaction(async () => {
        const rsUser = await UserModel.create({
          ...user,
          password: hashSync(user.password, 10),
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

  async findPermissions(): Promise<any> {
    return await UserModel.findAll({
      attributes: ["id", "fullname"],
      include: [
        {
          model: RoleModel,
          through: { attributes: [] },
          include: [
            {
              model: PermissionModel,
              through: { attributes: [] },
              attributes: ["id", "slug"],
            },
          ],
        },
      ],
    });
  }

  async findOne(user: Partial<IUser>): Promise<IUserResponse | undefined> {
    const _a = await UserModel.findOne({
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
          model: RoleModel,
          through: { attributes: [] },
          attributes: ["id", "name", "description", "priority"],
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
      roles: (_a["user-role"] ?? []).map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        priority: role.priority,
      })),
      createdAt: _a.createdAt,
      updatedAt: _a.updatedAt,
    };
  }

  async update(user: IUserPayload): Promise<number> {
    try {
      console.log(user);
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
