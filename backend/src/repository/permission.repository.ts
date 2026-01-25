import { IPermissionCatalog, IRolePayload } from "@type/permission.type";
import { PermissionModel } from "@model/permission.model";

class PermissionRepository {
  async findAll(): Promise<IPermissionCatalog[]> {
    const permissions = await PermissionModel.findAll({
      attributes: ["id", "slug", "label", "module", "page"],
      order: [
        ["module", "ASC"],
        ["page", "ASC"],
        ["label", "ASC"],
      ],
      raw: true,
    });

    const moduleMap = new Map<string, IPermissionCatalog>();

    permissions.map((permission) => {
      if (!moduleMap.has(permission.module)) {
        moduleMap.set(permission.module, {
          id: permission.module,
          moduleName: permission.module,
          page: [],
        });
      }

      const module = moduleMap.get(permission.module);

      let page = module!.page.find((p) => p.id === permission.page);

      if (!page) {
        page = {
          id: permission.page,
          name: permission.page,
          permission: [],
        };
        module!.page.push(page);
      }
      page.permission.push({
        id: permission.id,
        label: permission.label,
        slug: permission.slug,
      });
    });

    return Array.from(moduleMap.values());
  }
}

export const permissionRepository = new PermissionRepository();
