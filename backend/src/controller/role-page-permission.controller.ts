import { Request, Response } from "express";
import { rolePagePermissionRepository } from "repository/role-page-permission.repository";

class RolePagePermissionController {
  create({ body }: Request, res: Response) {
    rolePagePermissionRepository
      .create(body.rolePagePermission)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  update({ body }: Request, res: Response) {
    rolePagePermissionRepository
      .update(body.rolePagePermission)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  delete({ query }: Request, res: Response) {
    rolePagePermissionRepository
      .delete(
        query.idPage as string,
        query.idPermission as string,
        query.idRole as string
      )
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }
}

export const rolePagePermissionController = new RolePagePermissionController();
