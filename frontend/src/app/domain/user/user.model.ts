import { RoleModel } from '@domain/role/role.model';

export interface UserModel {
  userId?: string;
  username: string;
  userPass: string;
  userMail: string;
  userFullName: string;
  userRole: RoleModel;
  userStatus: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModelDTO {
  userId?: string;
  username: string;
  userPass: string;
  userMail: string;
  userFullName: string;
  userRoleId: string;
  userStatus: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
