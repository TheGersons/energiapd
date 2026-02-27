import prisma from "@database/index";
import { IUser, IUserPayload, IUserResponse } from "@type/user.type";
import { hash } from "bcrypt";

class UserRepository {
  async findAll(): Promise<IUserResponse[]> {
    const a = await prisma.user.findMany({
      omit: {
        password: true,
      },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                priority: true,
              },
            },
          },
        },
      },
    });

    return a.map((_a) => ({
      id: _a.id,
      nickname: _a.nickname,
      email: _a.email,
      fullname: _a.fullname,
      status: _a.status,
      requestChangePass: _a.requestChangePass,
      createdAt: _a.createdAt,
      updatedAt: _a.updatedAt,
      roles: _a.userRoles.map((_b) => ({
        id: _b.role.id,
        name: _b.role.name,
        description: _b.role.description,
        priority: _b.role.priority,
      })),
    }));
  }

  async create(user: IUserPayload): Promise<{ id: string }> {
    try {
      const { roles, ...userDTO } = user;
      return await prisma.user.create({
        data: {
          ...userDTO,
          password: await hash(user.password, 10),
          userRoles: {
            createMany: {
              data: roles.map((a) => ({
                idRole: a.idRole,
              })),
            },
          },
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(user: Partial<IUser>): Promise<IUserResponse | undefined> {
    const a = await prisma.user.findUnique({
      omit: { password: true },
      where: { id: user.id },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                priority: true,
              },
            },
          },
        },
      },
    });

    if (!a) return undefined;

    return {
      id: a?.id,
      nickname: a?.nickname,
      email: a.email,
      fullname: a.fullname,
      status: a.status,
      requestChangePass: a.requestChangePass,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      roles: a.userRoles.map((_a) => ({
        id: _a.role.id,
        name: _a.role.name,
        description: _a.role.description,
        priority: _a.role.priority,
      })),
    };
  }

  async update(user: IUserPayload): Promise<number> {
    try {
      const { roles, ...userDTO } = user;
      return await prisma.$transaction(async (transaction) => {
        const rsUser = [
          {
            ...(await transaction.user.update({
              data: { ...userDTO, password: await hash(user.password, 10) },
              where: { id: user.id },
            })),
          },
        ].length;

        const rsUserRoleDestroy = (
          await transaction.userRole.deleteMany({ where: { idUser: user.id } })
        ).count;

        const rsUserRoleCreate = (
          await transaction.userRole.createMany({ data: user.roles })
        ).count;

        return rsUser + rsUserRoleCreate + rsUserRoleDestroy;
      });
    } catch (e) {
      throw e;
    }
  }

  async activeCount(): Promise<number> {
    return await prisma.user.count({ where: { status: true } });
  }

  async inactiveCount(): Promise<number> {
    return await prisma.user.count({ where: { status: false } });
  }

  async totalCount(): Promise<number> {
    return await prisma.user.count();
  }
}

export const userRepository = new UserRepository();
