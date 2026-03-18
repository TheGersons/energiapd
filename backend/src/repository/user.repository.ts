import prisma from "@database/index";
import { IUser, IUserPayload, IUserResponse } from "@type/user.type";
import { hash } from "bcrypt";

class UserRepository {
  /**
   * Obtiene todos los usuarios con sus roles y departamento.
   */
  async findAll(): Promise<IUserResponse[]> {
    const users = await prisma.user.findMany({
      omit: { password: true },
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
        department: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return users.map((user) => this.mapToUserResponse(user));
  }

  /**
   * Crea un usuario, hashea su password y asigna roles en una operación.
   */
  async create(user: IUserPayload): Promise<{ id: string }> {
    const { roles, password, ...userDTO } = user;
    const hashedPassword = await hash(password, 10);

    return await prisma.user.create({
      data: {
        ...userDTO,
        password: hashedPassword,
        userRoles: {
          createMany: {
            data: roles.map((r) => ({ idRole: r.idRole })),
          },
        },
      },
      select: { id: true },
    });
  }

  /**
   * Busca un usuario por ID y formatea la respuesta.
   */
  async findOne(where: Partial<IUser>): Promise<IUserResponse | undefined> {
    if (!where.id) return undefined;

    const user = await prisma.user.findUnique({
      omit: { password: true },
      where: { id: where.id },
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
        department: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return user ? this.mapToUserResponse(user) : undefined;
  }

  /**
   * Actualiza datos de usuario y sincroniza roles mediante una transacción.
   */
  async update(user: IUserPayload): Promise<number> {
    const { roles, password, id, ...userDTO } = user;

    if (!id) throw new Error("ID de usuario no proporcionado");

    return await prisma.$transaction(async (tx) => {
      let totalChanges = 0;

      const hashedPassword = await hash(password, 10);
      await tx.user.update({
        data: { ...userDTO, password: hashedPassword },
        where: { id },
      });
      totalChanges++;

      // 2. Sincronizar Roles: Eliminar anteriores e insertar nuevos
      const deleted = await tx.userRole.deleteMany({ where: { idUser: id } });
      totalChanges += deleted.count;

      const created = await tx.userRole.createMany({
        data: roles.map((r) => ({ idUser: id, idRole: r.idRole })),
      });
      totalChanges += created.count;

      return totalChanges;
    });
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

  private mapToUserResponse(user: any): IUserResponse {
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      fullname: user.fullname,
      status: user.status,
      requestChangePass: user.requestChangePass,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      department: user.department,
      roles: user.userRoles.map((ur: any) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
        priority: ur.role.priority,
      })),
    };
  }
}

export const userRepository = new UserRepository();
