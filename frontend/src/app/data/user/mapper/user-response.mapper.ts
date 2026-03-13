import { Mapper } from '@base/mapper';
import { UserResponseEntity } from '../user.entity';
import { UserResponseModel } from '@domain/user/user.model';

export class UserResponseMapper extends Mapper<
  UserResponseEntity,
  UserResponseModel
> {
  override mapFrom(param: UserResponseEntity): UserResponseModel {
    return {
      userId: param.id,
      displayName: param.fullname,
      userRoles: param.roles.map((b) => ({
        roleId: b.id,
        roleName: b.name,
        roleDescription: b.description,
        rolePriority: b.priority,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
      userDepartment: {
        departmentId: param.department.id,
        departmentName: param.department.name,
        createdAt: param.department.createdAt,
        updatedAt: param.department.updatedAt,
      },
      needChangePass: param.requestChangePass,
      userMail: param.email,
      username: param.nickname,
      userStatus: param.status,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }

  override mapTo(param: UserResponseModel): UserResponseEntity {
    return {
      id: param.userId,
      email: param.userMail,
      fullname: param.displayName,
      nickname: param.username,
      requestChangePass: param.needChangePass,
      roles: param.userRoles.map((b) => ({
        id: b.roleId,
        name: b.roleName,
        description: b.roleDescription,
        priority: b.rolePriority,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
      department: {
        id: param.userDepartment.departmentId,
        name: param.userDepartment.departmentName,
        createdAt: param.userDepartment.createdAt,
        updatedAt: param.userDepartment.updatedAt,
      },
      status: param.userStatus,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
    };
  }
}
