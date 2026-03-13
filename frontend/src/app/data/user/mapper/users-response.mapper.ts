import { Mapper } from '@base/mapper';
import { UserResponseEntity } from '../user.entity';
import { UserResponseModel } from '@domain/user/user.model';

export class UsersResponseMapper extends Mapper<
  UserResponseEntity[],
  UserResponseModel[]
> {
  override mapFrom(param: UserResponseEntity[]): UserResponseModel[] {
    return param.map((a) => ({
      userId: a.id,
      displayName: a.fullname,
      userRoles: a.roles.map((b) => ({
        roleId: b.id,
        roleName: b.name,
        roleDescription: b.description,
        rolePriority: b.priority,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
      needChangePass: a.requestChangePass,
      userDepartment: {
        departmentId: a.department.id,
        departmentName: a.department.name,
        createdAt: a.department.createdAt,
        updatedAt: a.department.updatedAt,
      },
      userMail: a.email,
      username: a.nickname,
      userStatus: a.status,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }

  override mapTo(param: UserResponseModel[]): UserResponseEntity[] {
    return param.map((a) => ({
      id: a.userId,
      email: a.userMail,
      fullname: a.displayName,
      nickname: a.username,
      requestChangePass: a.needChangePass,
      roles: a.userRoles.map((b) => ({
        id: b.roleId,
        name: b.roleName,
        description: b.roleDescription,
        priority: b.rolePriority,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
      department: {
        id: a.userDepartment.departmentId,
        name: a.userDepartment.departmentName,
        createdAt: a.userDepartment.createdAt,
        updatedAt: a.userDepartment.updatedAt,
      },
      status: a.userStatus,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  }
}
