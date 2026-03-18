import { IRole, IRolePayload } from "@type/role.type";
import prisma from "@database/index";

class RoleRepository {
  /**
   * Obtiene todos los roles ordenados por fecha de creación.
   */
  async findAll(): Promise<IRole[]> {
    return await prisma.role.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Busca un rol específico con sus permisos asociados.
   */
  async findOne(role: Partial<IRole>): Promise<IRolePayload | null> {
    if (!role.id) return null;

    return (await prisma.role.findUnique({
      where: { id: role.id },
      include: {
        rolePermission: {
          select: {
            id: true,
            idRole: true,
            idPermission: true,
          },
        },
      },
    })) as IRolePayload | null;
  }

  /**
   * Crea un rol y asigna sus permisos en una sola operación atómica.
   */
  async create(role: IRolePayload): Promise<IRolePayload> {
    const { rolePermission, id, ...roleDTO } = role;

    return (await prisma.role.create({
      data: {
        ...roleDTO,
        rolePermission: {
          createMany: {
            data: rolePermission.map((rp) => ({
              idPermission: rp.idPermission,
            })),
          },
        },
      },
      include: {
        rolePermission: true,
      },
    })) as IRolePayload;
  }

  /**
   * Actualiza un rol y sincroniza sus permisos
   */
  async update(role: IRolePayload): Promise<number> {
    const { rolePermission, ...roleDTO } = role;
    const roleId = role.id ?? "";

    return await prisma.$transaction(async (tx) => {
      let affectedRows = 0;

      const updateResult = await tx.role.updateMany({
        data: roleDTO,
        where: { id: roleId },
      });
      affectedRows += updateResult.count;

      const deleteResult = await tx.rolePermission.deleteMany({
        where: { idRole: roleId },
      });
      affectedRows += deleteResult.count;

      const rolePermissionsToInsert = rolePermission.map((rp) => ({
        idPermission: rp.idPermission,
        idRole: roleId,
      }));

      const insertResult = await tx.rolePermission.createMany({
        data: rolePermissionsToInsert,
      });
      affectedRows += insertResult.count;

      return affectedRows;
    });
  }

  /**
   * Elimina un rol y sus permisos asociados.
   */
  async delete(id: string): Promise<number> {
    return await prisma.$transaction(async (tx) => {
      let affectedRows = 0;

      const permissionsDeleted = await tx.rolePermission.deleteMany({
        where: { idRole: id },
      });
      affectedRows += permissionsDeleted.count;

      const roleDeleted = await tx.role.deleteMany({
        where: { id },
      });
      affectedRows += roleDeleted.count;

      return affectedRows;
    });
  }
}

export const roleRepository = new RoleRepository();
