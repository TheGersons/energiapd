export interface IRole {
  id?: string;
  name: string;
  description: string;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRolePayload {
  id?: string;
  name: string;
  description: string;
  priority: number;
  rolePermission: IRolePermission[];
}

export interface IRolePermission {
  id?: string;
  idRole?: string;
  idPermission: string;
}
