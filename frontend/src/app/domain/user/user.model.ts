import { PlaneRoleModel } from '@domain/role/role.model';

export interface UserModel {
  userId?: string;
  displayName: string;
  username: string;
  userMail: string;
  userStatus: boolean;
  needChangePass: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponseModel {
  userId?: string;
  displayName: string;
  username: string;
  userMail: string;
  userStatus: boolean;
  userRoles: PlaneRoleModel[];
  needChangePass: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayloadModel {
  userId?: string;
  displayName: string;
  username: string;
  userMail: string;
  userPass: string;
  userStatus: boolean;
  userRoles: IUserRole[];
  needChangePass: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface IUserRole {
  userRoleId?: string;
  userId: string;
  roleId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFormModel extends Omit<UserPayloadModel, 'userRoles'> {
  userRoles: PlaneRoleModel[];
}
