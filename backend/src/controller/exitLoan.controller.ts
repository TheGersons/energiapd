import { Request, Response } from "express";
import { exitLoanRepository } from "repository/exitLoan.repository";
import { errorResponse } from "utils/errorResponse";

class ExitLoanController {
  private getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  };

  register = async ({ body }: Request, res: Response): Promise<void> => {
    try {
      if (!body.idLoan) {
        errorResponse(res, 400, "El cuerpo de la solicitud es inválido.");
        return;
      }

      const rs = await exitLoanRepository.register(body.idLoan);

      res.status(201).json(rs);
    } catch (error: any) {
      if (error?.name === "SequelizeValidationError") {
        errorResponse(
          res,
          422,
          "Datos inválidos",
          error.errors?.map((e: any) => e.message),
        );
        return;
      }

      if (error?.name === "SequelizeForeignKeyConstraintError") {
        errorResponse(res, 400, "Referencia no válida.");
        return;
      }

      errorResponse(
        res,
        500,
        "Error al crear el registro",
        this.getErrorMessage(error),
      );
    }
  };

  findByLoan = async ({ query }: Request, res: Response) => {
    try {
      if (!query || Object.keys(query).length === 0) {
        res.status(200).json({});
        return;
      }

      const rs = await exitLoanRepository.findByLoan(query);
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener los registros.",
        this.getErrorMessage(error),
      );
    }
  };
}

export const exitLoanController = new ExitLoanController();
