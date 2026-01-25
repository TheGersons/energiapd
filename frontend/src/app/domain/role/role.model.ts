export interface RoleModel {
  roleId?: string;
  roleName: string;
  roleDescription: string;
  rolePriority: number;
  permission: IRolePermission[];
}

interface IRolePermission {
  rolePermissionId?: string;
  roleId?: string;
  permissionId: string;
}
