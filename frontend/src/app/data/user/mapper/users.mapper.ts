import { Mapper } from '@base/mapper';
import { UserEntity } from '../user.entity';
import { UserModel } from '@domain/user/user.model';

export class UsersMapper extends Mapper<UserEntity[], UserModel[]> {
  override mapFrom(param: UserEntity[]): UserModel[] {
    return param.map((a) => ({
      userId: a.id,
      displayName: a.fullname,
      needChangePass: a.requestChangePass,
      userMail: a.email,
      username: a.nickname,
      userStatus: a.status,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: UserModel[]): UserEntity[] {
    return param.map((a) => ({
      id: a.userId,
      email: a.userMail,
      fullname: a.displayName,
      nickname: a.username,
      requestChangePass: a.needChangePass,
      status: a.userStatus,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }
}
