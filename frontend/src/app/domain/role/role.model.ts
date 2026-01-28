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

export interface PlaneRoleModel {
  roleId: string;
  roleName: string;
  roleDescription: string;
  rolePriority: number;
  createdAt?: string;
  updatedAt?: string;
}
