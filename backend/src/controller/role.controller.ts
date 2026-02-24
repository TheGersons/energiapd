import { IRolePayload } from "@type/role.type";
import { Request, Response } from "express";
import { roleRepository } from "repository/role.repository";
import { errorResponse } from "utils/errorResponse";

class RoleController {
  async findAll(req: Request, res: Response) {
    roleRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        errorResponse(res, 500, "Error al obtener los roles.", error?.message),
      );
  }

  findOne({ query }: Request, res: Response) {
    if (!query || Object.keys(query).length === 0) {
      res.json({});
      return;
    }
    roleRepository
      .findOne(query)
      .then((rs) => {
        if (!rs) {
          errorResponse(res, 404, "Rol no encontrado.");
        }
        res.status(200).json(rs);
      })
      .catch((error) =>
        errorResponse(res, 500, "Error al buscar el rol.", error?.message),
      );
  }

  async create(req: Request, res: Response) {
    if (!req.body?.role) {
      errorResponse(res, 400, "El cuerpo de la solicitud es inválido.");
    }
    roleRepository
      .create(req.body.role)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => {
        console.error("[LoanController.create]", error);

        if (error?.name === "SequelizeValidationError") {
          errorResponse(
            res,
            422,
            "Datos del rol inválidos.",
            error.errors?.map((e: any) => e.message),
          );
        }

        if (error?.name === "SequelizeForeignKeyConstraintError") {
          errorResponse(res, 400, "Un permiso o más referenciados no existen.");
        }

        errorResponse(
          res,
          500,
          "Ocurrió un error al crear el rol.",
          error?.message,
        );
      });
  }

  async update({ body }: Request, res: Response) {
    if (!body?.role?.id) {
      errorResponse(res, 400, "El ID del rol es requerido.");
    }
    roleRepository
      .update(body.role as IRolePayload)
      .then((rs) => {
        if (rs === 0) {
          errorResponse(res, 404, "Rol no encontrado o sin cambios.");
        }
        res.status(200).json(rs);
      })
      .catch((error) =>
        errorResponse(
          res,
          500,
          "Error al actualizar el préstamo.",
          error?.message,
        ),
      );
  }

  delete({ query }: Request, res: Response) {
    roleRepository
      .delete(query.id as string)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(500).json(error));
  }
}

export const roleController = new RoleController();
