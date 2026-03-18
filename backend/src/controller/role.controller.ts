import { IRolePayload } from "@type/role.type";
import { Request, Response } from "express";
import { roleRepository } from "repository/role.repository";
import { errorResponse } from "utils/errorResponse";

class RoleController {
  private getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await roleRepository.findAll();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener los roles.",
        this.getErrorMessage(error),
      );
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req;
      if (!query || Object.keys(query).length === 0) {
        res.status(200).json({});
        return;
      }

      const rs = await roleRepository.findOne(query);
      if (!rs) {
        errorResponse(res, 404, "Rol no encontrado.");
        return;
      }

      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al buscar el rol.",
        this.getErrorMessage(error),
      );
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body?.role) {
        errorResponse(res, 400, "El cuerpo de la solicitud es inválido.");
        return;
      }

      const rs = await roleRepository.create(req.body.role);
      res.status(201).json(rs);
    } catch (error: any) {
      console.error("[RoleController.create]", error);

      if (error?.name === "SequelizeValidationError") {
        errorResponse(
          res,
          422,
          "Datos del rol inválidos.",
          error.errors?.map((e: any) => e.message),
        );
        return;
      }

      if (error?.name === "SequelizeForeignKeyConstraintError") {
        errorResponse(res, 400, "Un permiso o más referenciados no existen.");
        return;
      }

      errorResponse(
        res,
        500,
        "Ocurrió un error al crear el rol.",
        this.getErrorMessage(error),
      );
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { body } = req;
      if (!body?.role?.id) {
        errorResponse(res, 400, "El ID del rol es requerido.");
        return;
      }

      const rs = await roleRepository.update(body.role as IRolePayload);
      if (rs === 0) {
        errorResponse(res, 404, "Rol no encontrado o sin cambios.");
        return;
      }

      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al actualizar el rol.",
        this.getErrorMessage(error),
      );
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.query;
      if (!id) {
        errorResponse(res, 400, "El ID del rol es requerido para eliminar.");
        return;
      }

      const rs = await roleRepository.delete(id as string);
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al eliminar el rol.",
        this.getErrorMessage(error),
      );
    }
  };
}

export const roleController = new RoleController();
