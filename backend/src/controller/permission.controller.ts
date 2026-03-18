import { Request, Response } from "express";
import { permissionRepository } from "repository/permission.repository";
import { errorResponse } from "utils/errorResponse";

class PermissionController {
  private getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await permissionRepository.findAll();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener los permisos.",
        this.getErrorMessage(error),
      );
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await permissionRepository.findOne((req as any).idUser);

      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener los permisos.",
        this.getErrorMessage(error),
      );
    }
  };
}

export const permissionController = new PermissionController();
