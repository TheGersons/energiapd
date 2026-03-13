import { Request, Response } from "express";
import { departmentRepository } from "repository/department.repository";
import { errorResponse } from "utils/errorResponse";

class DepartmentController {
  findAll(req: Request, res: Response) {
    departmentRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        errorResponse(
          res,
          500,
          "Error al obtener los departamentos",
          error?.message,
        ),
      );
  }

  findOne({ query }: Request, res: Response) {
    if (!query || Object.keys(query).length === 0) {
      res.json({});
    }
    departmentRepository
      .findOne(query)
      .then((rs) => {
        if (!rs) errorResponse(res, 404, "Departamento no encontrado");

        res.status(200).json(rs);
      })
      .catch((error) =>
        errorResponse(
          res,
          500,
          "Error al buscar el departamento",
          error?.message,
        ),
      );
  }

  create({ body }: Request, res: Response) {
    if (!body?.department)
      errorResponse(res, 400, "El cuerpo de la solicitud es inválido.");

    departmentRepository
      .create(body.department)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => {
        console.log(error);
        if (error?.name === "SequelizeValidationError") {
          return errorResponse(
            res,
            422,
            "Datos del departamento inválidos.",
            error.errors?.map((e: any) => e.message),
          );
        }

        return errorResponse(
          res,
          500,
          "Ocurrió un error al crear el departamento.",
          error?.message,
        );
      });
  }

  update({ body }: Request, res: Response) {
    if (!body?.department?.id) {
      return errorResponse(res, 400, "El ID del departamento es requerido.");
    }

    departmentRepository
      .update(body.department)
      .then((rs) => {
        if (rs === 0) {
          return errorResponse(
            res,
            404,
            "Departamento no encontrado o sin cambios",
          );
        }
        res.status(200).json(rs);
      })
      .catch((error) =>
        errorResponse(
          res,
          500,
          "Error al actualizar el departamento.",
          error?.message,
        ),
      );
  }
}

export const departmentController = new DepartmentController();
