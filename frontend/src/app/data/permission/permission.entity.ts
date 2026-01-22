export interface PermissionEntity {
  id?: string;
  name: string;
  label: string;
}

export interface PermissionsByRoleEntity {
  id: string;
  rolePage: Page[];
}

export interface RolePagePermissionEntity {
  id?: string;
  idRole: string;
  idPage: string;
  idPermission: string;
}

interface Page {
  id: string;
  idModule: string;
  pagePermission: Array<{ name: string }>;
}
