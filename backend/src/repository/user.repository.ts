import { RoleModel } from "@model/role.model";
import { UserModel } from "@model/user.model";
import { IUser, IUserDTO } from "@type/user.type";

class UserRepository {
  async findAll(): Promise<IUser[]> {
    return await UserModel.findAll({
      attributes: [
        'id',
        'fullname',
        'nickname',
        'email',
        'status',
        'createdAt',
        'updatedAt',
      ],
      include: 
        {
          model: RoleModel
        },
    });
  }

  async create(user: IUserDTO): Promise<IUserDTO> {
    return await UserModel.create(user);
  }
}

export const userRepository = new UserRepository();
