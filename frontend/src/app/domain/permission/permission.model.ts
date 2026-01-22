export interface PermissionModel {
  permissionId?: string;
  permissionName: string;
  permissionLabel: string;
}

export interface PermissionsByRoleModel {
  roleId: string;
  page: Page[];
}

export interface RolePagePermissionModel {
  rolePagePermissionId?: string;
  roleId: string;
  pageId: string;
  permissionId: string;
}

interface Page {
  pageId: string;
  moduleId: string;
  permission: Array<{ name: string }>;
}
