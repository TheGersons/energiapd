import { IRole } from "./role.type";

export interface IUser {
  id?: string;
  nickname: string;
  password?: string;
  email: string;
  fullname: string;
  role?: IRole;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDTO {
  id?: string;
  nickname: string;
  password: string;
  email: string;
  fullname: string;
  idRole: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
