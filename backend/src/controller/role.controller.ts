import { Request, Response } from "express";
import { roleRepository } from "repository/role.repository";

class RoleController {
  async findAll(req: Request, res: Response) {
    roleRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(400).json(error));
  }

  async create(req: Request, res: Response) {

    console.log(req.body)
    roleRepository
      .create(req.body.role)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(400).json(error));
  }
}

export const roleController = new RoleController();
