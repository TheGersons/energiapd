import { RoleEntity } from '@data/role/role.entity';

export interface UserEntity {
  id?: string;
  nickname: string;
  password: string;
  email: string;
  fullname: string;
  role: RoleEntity;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserEntityDTO {
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
