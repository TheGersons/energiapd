import { IRolePayload } from "@type/role.type";
import { Request, Response } from "express";
import { roleRepository } from "repository/role.repository";

class RoleController {
  async findAll(req: Request, res: Response) {
    roleRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(400).json(error));
  }

  findOne({ query }: Request, res: Response) {
    if (!query || Object.keys(query).length === 0) {
      res.json({});
      return;
    }
    roleRepository
      .findOne(query)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }

  async create(req: Request, res: Response) {
    roleRepository
      .create(req.body.role)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(400).json(error));
  }

  async update({ body }: Request, res: Response) {
    roleRepository
      .update(body.role as IRolePayload)
      .then((rs) => res.status(200).json(rs));
  }
}

export const roleController = new RoleController();
