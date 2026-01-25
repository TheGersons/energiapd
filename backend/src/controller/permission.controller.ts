import { IPermissionCatalog } from "@type/permission.type";
import { Request, Response } from "express";
import { permissionRepository } from "repository/permission.repository";

class PermissionController {
  async findAll(req: Request, res: Response) {
    permissionRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(400).json(error));
  }
}

export const permissionController = new PermissionController();
