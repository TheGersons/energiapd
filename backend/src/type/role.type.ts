export interface IRole {
  id?: string;
  name: string;
  description: string;
  priority: number;
  createdAt?: Date;
  updatedAt?: Date;
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
