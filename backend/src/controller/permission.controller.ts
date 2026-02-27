import { Request, Response } from "express";
import { permissionRepository } from "repository/permission.repository";
import { errorResponse } from "utils/errorResponse";

class PermissionController {
  async findAll(req: Request, res: Response) {
    permissionRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        errorResponse(
          res,
          500,
          "Error al obtener los permisos.",
          error?.message,
        ),
      );
  }

  async findOne(req: Request, res: Response) {
    permissionRepository.findOne(req.idUser);
  }
}

export const permissionController = new PermissionController();
