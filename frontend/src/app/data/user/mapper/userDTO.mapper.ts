import { Mapper } from '@base/mapper';
import { UserEntityDTO } from '../user.entity';
import { UserModelDTO } from '@domain/user/user.model';

export class UserDTOMapper extends Mapper<UserEntityDTO, UserModelDTO> {
  override mapFrom(param: UserEntityDTO): UserModelDTO {
    return {
      userId: param.id,
      username: param.nickname,
      userPass: param.password,
      userMail: param.email,
      userFullName: param.fullname,
      userRoleId: param.idRole,
      userStatus: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: UserModelDTO): UserEntityDTO {
    return {
      id: param.userId,
      nickname: param.username,
      password: param.userPass,
      email: param.userMail,
      fullname: param.userFullName,
      idRole: param.userRoleId,
      status: param.userStatus,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
