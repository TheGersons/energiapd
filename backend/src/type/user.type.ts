import { IRole } from "./role.type";
import { IUserRole } from "./user-role.type";

export interface IUser {
  id?: string;
  fullname: string;
  nickname: string;
  email: string;
  status: boolean;
  requestChangePass: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserPayload {
  id?: string;
  nickname: string;
  password: string;
  email: string;
  fullname: string;
  status: boolean;
  roles: IUserRole[];
  requestChangePass: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  id?: string;
  nickname: string;
  email: string;
  fullname: string;
  status: boolean;
  roles: IRole[];
  requestChangePass: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
