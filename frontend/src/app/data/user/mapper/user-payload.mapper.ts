import { Mapper } from '@base/mapper';
import { UserPayloadEntity } from '../user.entity';
import { UserPayloadModel } from '@domain/user/user.model';

export class UserPayloadMapper extends Mapper<
  UserPayloadEntity,
  UserPayloadModel
> {
  override mapFrom(param: UserPayloadEntity): UserPayloadModel {
    return {
      userId: param.id,
      displayName: param.fullname,
      needChangePass: param.requestChangePass,
      userMail: param.email,
      username: param.nickname,
      userPass: param.password,
      userRoles: param.roles.map((a) => ({
        userRoleId: a.id,
        roleId: a.idRole,
        userId: a.idUser,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      userStatus: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: UserPayloadModel): UserPayloadEntity {
    return {
      id: param.userId,
      email: param.userMail,
      fullname: param.displayName,
      nickname: param.username,
      password: param.userPass,
      requestChangePass: param.needChangePass,
      roles: param.userRoles.map((a) => ({
        id: a.userRoleId,
        idRole: a.roleId,
        idUser: a.userId,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      status: param.userStatus,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
