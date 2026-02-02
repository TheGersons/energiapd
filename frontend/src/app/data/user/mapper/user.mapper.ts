import { Mapper } from '@base/mapper';
import { UserEntity } from '../user.entity';
import { UserModel } from '@domain/user/user.model';

export class UserMapper extends Mapper<UserEntity, UserModel> {
  override mapFrom(param: UserEntity): UserModel {
    return {
      userId: param.id,
      displayName: param.fullname,
      needChangePass: param.requestChangePass,
      userMail: param.email,
      username: param.nickname,
      userStatus: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: UserModel): UserEntity {
    return {
      id: param.userId,
      email: param.userMail,
      fullname: param.displayName,
      nickname: param.username,
      requestChangePass: param.needChangePass,
      status: param.userStatus,
    };
  }
}
