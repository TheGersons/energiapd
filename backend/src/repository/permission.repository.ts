import { IPermissionCatalog } from "@type/permission.type";
import prisma from "@database/index";

class PermissionRepository {
  /**
   * Obtiene todos los permisos y los agrupa jerárquicamente por Módulo y Página.
   */
  async findAll(): Promise<IPermissionCatalog[]> {
    const permissions = await prisma.permission.findMany({
      select: {
        id: true,
        slug: true,
        label: true,
        module: true,
        page: true,
      },
    });

    const moduleMap = new Map<string, IPermissionCatalog>();

    for (const permission of permissions) {
      if (!moduleMap.has(permission.module)) {
        moduleMap.set(permission.module, {
          id: permission.module,
          moduleName: permission.module,
          page: [],
        });
      }

      const module = moduleMap.get(permission.module)!;

      let page = module.page.find((p) => p.id === permission.page);

      if (!page) {
        page = {
          id: permission.page,
          name: permission.page,
          permission: [],
        };
        module.page.push(page);
      }

      page.permission.push({
        id: permission.id,
        label: permission.label,
        slug: permission.slug,
      });
    }

    return Array.from(moduleMap.values());
  }

  /**
   * Obtiene la lista plana de slugs de permisos asociados a un usuario.
   */
  async findOne(idUser: string): Promise<string[]> {
    const permissions = await prisma.permission.findMany({
      where: {
        rolePermissions: {
          some: {
            role: {
              userRoles: {
                some: { idUser },
              },
            },
          },
        },
      },
      select: {
        slug: true,
      },
    });

    return permissions.map((p) => p.slug);
  }
}

export const permissionRepository = new PermissionRepository();
