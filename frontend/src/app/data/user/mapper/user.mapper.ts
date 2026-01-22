import { Mapper } from '@base/mapper';
import { UserEntity } from '../user.entity';
import { UserModel } from '@domain/user/user.model';

export class UserMapper extends Mapper<UserEntity, UserModel> {
  override mapFrom(param: UserEntity): UserModel {
    return {
      userId: param.id,
      username: param.nickname,
      userPass: param.password,
      userMail: param.email,
      userFullName: param.fullname,
      userRole: {
        roleId: param.role.id,
        roleName: param.role.name,
        roleDescription: param.role.description,
        createdAt: param.role.createdAt,
        updatedAt: param.role.updatedAt,
      },
      userStatus: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: UserModel): UserEntity {
    return {
      id: param.userId,
      nickname: param.username,
      password: param.userPass,
      email: param.userMail,
      fullname: param.userFullName,
      role: {
        id: param.userRole.roleId,
        name: param.userRole.roleName,
        description: param.userRole.roleDescription,
        createdAt: param.userRole.createdAt,
        updatedAt: param.userRole.updatedAt,
      },
      status: param.userStatus,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
