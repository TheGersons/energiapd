import { Mapper } from '@base/mapper';
import { UserEntity } from '../user.entity';
import { UserModel } from '@domain/user/user.model';

export class PartialUserModelMapper extends Mapper<
  Partial<UserEntity>,
  Partial<UserModel>
> {
  override mapFrom(param: Partial<UserEntity>): Partial<UserModel> {
    return {
      ...(param.id !== undefined && { userId: param.id }),
      ...(param.fullname !== undefined && { displayName: param.fullname }),
      ...(param.nickname !== undefined && { username: param.nickname }),
      ...(param.email !== undefined && { userMail: param.email }),
      ...(param.status !== undefined && { userStatus: param.status }),
      ...(param.requestChangePass !== undefined && {
        needChangePass: param.requestChangePass,
      }),
      ...(param.createdAt !== undefined && { createdAt: param.createdAt }),
      ...(param.updatedAt !== undefined && { updatedAt: param.updatedAt }),
    };
  }

  override mapTo(param: Partial<UserModel>): Partial<UserEntity> {
    return {
      ...(param.userId !== undefined && { id: param.userId }),
      ...(param.displayName !== undefined && { fullname: param.displayName }),
      ...(param.username !== undefined && { nickname: param.username }),
      ...(param.userMail !== undefined && { email: param.userMail }),
      ...(param.userStatus !== undefined && { status: param.userStatus }),
      ...(param.needChangePass !== undefined && {
        requestChangePass: param.needChangePass,
      }),
      ...(param.createdAt !== undefined && { createdAt: param.createdAt }),
      ...(param.updatedAt !== undefined && { updatedAt: param.updatedAt }),
    };
  }
}
