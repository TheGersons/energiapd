import { RolePermissionModel } from "@model/role-permission.model";
import { RoleModel } from "@model/role.model";
import { IRole, IRolePayload } from "@type/role.type";
import prisma from "@database/index";

class RoleRepository {
  async findAll(): Promise<IRole[]> {
    return await prisma.role.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findOne(role: Partial<IRole>): Promise<IRolePayload | null> {
    return prisma.role.findUnique({
      where: { id: role.id },
      include: {
        rolePermission: {
          select: { id: true, idRole: true, idPermission: true },
        },
      },
    });
  }

  async create(role: IRolePayload): Promise<IRolePayload> {
    try {
      const { rolePermission, id, ...roleDTO } = role;
      console.log(roleDTO, rolePermission);
      return await prisma.role.create({
        data: {
          ...roleDTO,
          rolePermission: {
            createMany: {
              data: rolePermission.map((a) => ({
                idPermission: a.idPermission,
              })),
            },
          },
        },
        include: {
          rolePermission: true,
        },
      });
    } catch (e: any) {
      throw new Error(e.message || e);
    }
  }

  async update(role: IRolePayload): Promise<number> {
    try {
      const { rolePermission, ...roleDTO } = role;
      return await prisma.$transaction(async (transaction) => {
        var a = 0;

        a += (
          await transaction.role.updateMany({
            data: roleDTO,
            where: { id: role.id },
          })
        ).count;

        a += (
          await transaction.rolePermission.deleteMany({
            where: { idRole: role.id },
          })
        ).count;

        const rolePermissionsToInsert = rolePermission.map((_a) => ({
          ..._a,
          idRole: role.id ?? "",
        }));

        a += (
          await transaction.rolePermission.createMany({
            data: rolePermissionsToInsert,
          })
        ).count;

        return a;
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string): Promise<number> {
    try {
      return await prisma.$transaction(async (transaction) => {
        var a = 0;

        a += (await prisma.role.deleteMany({ where: { id } })).count;

        a += (await prisma.rolePermission.deleteMany({ where: { idRole: id } }))
          .count;

        return a;
      });
    } catch (e) {
      throw e;
    }
  }
}

export const roleRepository = new RoleRepository();
