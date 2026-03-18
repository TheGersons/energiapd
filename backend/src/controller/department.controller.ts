import { Request, Response } from "express";
import { departmentRepository } from "repository/department.repository";
import { errorResponse } from "utils/errorResponse";

class DepartmentController {
  private getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await departmentRepository.findAll();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener los departamentos",
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

      const rs = await departmentRepository.findOne(query);
      if (!rs) {
        errorResponse(res, 404, "Departamento no encontrado");
        return;
      }

      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al buscar el departamento",
        this.getErrorMessage(error),
      );
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { body } = req;
      if (!body?.department) {
        errorResponse(res, 400, "El cuerpo de la solicitud es inválido.");
        return;
      }

      const rs = await departmentRepository.create(body.department);
      res.status(201).json(rs);
    } catch (error: any) {
      console.error(error);
      if (error?.name === "SequelizeValidationError") {
        errorResponse(
          res,
          422,
          "Datos del departamento inválidos.",
          error.errors?.map((e: any) => e.message),
        );
        return;
      }

      errorResponse(
        res,
        500,
        "Ocurrió un error al crear el departamento.",
        this.getErrorMessage(error),
      );
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { body } = req;
      if (!body?.department?.id) {
        errorResponse(res, 400, "El ID del departamento es requerido.");
        return;
      }

      const rs = await departmentRepository.update(body.department);
      if (rs === 0) {
        errorResponse(res, 404, "Departamento no encontrado o sin cambios");
        return;
      }

      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al actualizar el departamento.",
        this.getErrorMessage(error),
      );
    }
  };
}

export const departmentController = new DepartmentController();
