export interface RoleEntity {
  id?: string;
  name: string;
  description: string;
  priority: number;
  rolePermission: IRolePermission[];
}

interface IRolePermission {
  id?: string;
  idRole?: string;
  idPermission: string;
}