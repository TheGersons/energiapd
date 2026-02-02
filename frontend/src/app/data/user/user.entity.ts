export interface UserEntity {
  id?: string;
  fullname: string;
  nickname: string;
  email: string;
  status: boolean;
  requestChangePass: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayloadEntity {
  id?: string;
  nickname: string;
  password: string;
  email: string;
  fullname: string;
  status: boolean;
  roles: IUserRole[];
  requestChangePass: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponseEntity {
  id?: string;
  nickname: string;
  email: string;
  fullname: string;
  status: boolean;
  roles: IUserRole[];
  requestChangePass: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface IUserRole {
  id?: string;
  idUser: string;
  idRole: string;
  createdAt?: string;
  updatedAt?: string;
}
