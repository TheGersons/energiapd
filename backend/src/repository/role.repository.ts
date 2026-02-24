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
      return await prisma.$transaction(async (transaction) => {
        const rsRole = await transaction.role.create({
          data: {
            name: role.name,
            description: role.description,
            priority: Number(role.priority),
          },
        });

        const rolePermissionsToInsert = role.rolePermission.map((rp) => ({
          ...rp,
          idRole: rsRole.id,
        }));

        const rsRolePermission =
          await transaction.rolePermission.createManyAndReturn({
            data: rolePermissionsToInsert,
          });

        return { ...rsRole, rolePermission: rsRolePermission };
      });
    } catch (e: any) {
      throw new Error(e.message || e);
    }
  }

  async update(role: IRolePayload): Promise<number> {
    try {
      return await prisma.$transaction(async (transaction) => {
        var a = 0;

        a += (
          await transaction.role.updateMany({
            data: role,
            where: { id: role.id },
          })
        ).count;

        a += (
          await transaction.rolePermission.deleteMany({
            where: { idRole: role.id },
          })
        ).count;

        const rolePermissionsToInsert = role.rolePermission.map((_a) => ({
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
      console.error(e);
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
