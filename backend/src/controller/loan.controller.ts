import { Request, Response } from "express";
import { loanRepository } from "repository/loan.repository";

function errorResponse(
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown,
) {
  const body: Record<string, unknown> = { message, statusCode };
  if (details && process.env.NODE_ENV !== "production") {
    body["details"] = details;
  }
  return res.status(statusCode).json(body);
}

class LoanController {
  findAll(req: Request, res: Response) {
    loanRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) =>
        errorResponse(
          res,
          500,
          "Error al obtener los préstamos.",
          error?.message,
        ),
      );
  }

  findOne({ query }: Request, res: Response) {
    if (!query || Object.keys(query).length === 0) {
      res.json({});
    }
    loanRepository
      .findOne(query)
      .then((rs) => {
        if (!rs) {
          errorResponse(res, 404, "Préstamo no encontrado.");
        }
        res.status(200).json(rs);
      })
      .catch((error) =>
        errorResponse(res, 500, "Error al buscar el préstamo.", error?.message),
      );
  }

  create({ body }: Request, res: Response) {
    if (!body?.loan) {
      errorResponse(res, 400, "El cuerpo de la solicitud es inválido.");
    }

    loanRepository
      .create(body.loan)
      .then((rs) => res.status(201).json(rs))
      .catch((error) => {
        console.error("[LoanController.create]", error);

        // Errores de validación de Sequelize
        if (error?.name === "SequelizeValidationError") {
          return errorResponse(
            res,
            422,
            "Datos del préstamo inválidos.",
            error.errors?.map((e: any) => e.message),
          );
        }

        // Error de llave foránea (herramienta no existe, etc.)
        if (error?.name === "SequelizeForeignKeyConstraintError") {
          return errorResponse(
            res,
            400,
            "Una o más herramientas referenciadas no existen.",
          );
        }

        return errorResponse(
          res,
          500,
          "Ocurrió un error al crear el préstamo.",
          error?.message,
        );
      });
  }

  update({ body }: Request, res: Response) {
    if (!body?.loan?.id) {
      errorResponse(res, 400, "El ID del préstamo es requerido.");
    }

    loanRepository
      .update(body.loan)
      .then((rs) => {
        if (rs === 0) {
          return errorResponse(
            res,
            404,
            "Préstamo no encontrado o sin cambios.",
          );
        }
        return res.status(200).json(rs);
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
}

export const loanController = new LoanController();
