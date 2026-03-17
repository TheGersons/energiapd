import { Request, Response } from "express";
import { loanRepository } from "repository/loan.repository";
import { errorResponse } from "utils/errorResponse";
import { validate } from "uuid";

export interface AuthRequest extends Request {
  idUser?: string;
  permissions?: string[];
}

class LoanController {
  // Helper para mensajes de error
  private getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  };

  findAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rs = await loanRepository.findAll();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener los préstamos.",
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

      const rs = await loanRepository.findOne(query);
      if (!rs) {
        errorResponse(res, 404, "Préstamo no encontrado.");
        return;
      }
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al buscar el préstamo.",
        this.getErrorMessage(error),
      );
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { body } = req;
      if (!body?.loan) {
        errorResponse(res, 400, "El cuerpo de la solicitud es inválido.");
        return;
      }

      const rs = await loanRepository.create(body.loan);
      res.status(201).json(rs);
    } catch (error: any) {
      if (error?.name === "SequelizeValidationError") {
        errorResponse(
          res,
          422,
          "Datos del préstamo inválidos.",
          error.errors?.map((e: any) => e.message),
        );
        return;
      }
      if (error?.name === "SequelizeForeignKeyConstraintError") {
        errorResponse(
          res,
          400,
          "Una o más herramientas referenciadas no existen.",
        );
        return;
      }
      errorResponse(
        res,
        500,
        "Ocurrió un error al crear el préstamo.",
        this.getErrorMessage(error),
      );
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { body } = req;
      if (!body?.loan?.id) {
        errorResponse(res, 400, "El ID del préstamo es requerido.");
        return;
      }

      const rs = await loanRepository.update(body.loan);
      if (rs === 0) {
        errorResponse(res, 404, "Préstamo no encontrado o sin cambios.");
        return;
      }
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al actualizar el préstamo.",
        this.getErrorMessage(error),
      );
    }
  };

  approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idLoan, approved, status, notes } = req.body;
      if (
        idLoan === undefined ||
        approved === undefined ||
        status === undefined
      ) {
        errorResponse(res, 400, "El ID y Estado son requeridos.");
        return;
      }

      const rs = await loanRepository.approval(
        idLoan,
        (req as any).idUser,
        approved,
        status,
        notes || "",
      );
      if (!validate(rs)) {
        errorResponse(res, 404, "Préstamo no encontrado o sin cambios.");
        return;
      }
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al actualizar el préstamo.",
        this.getErrorMessage(error),
      );
    }
  };

  delivery = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idLoan, approved, status, notes } = req.body;
      const rs = await loanRepository.delivery(
        idLoan,
        (req as any).idUser,
        approved,
        status,
        notes || "",
      );
      if (!validate(rs)) {
        errorResponse(res, 404, "Préstamo no encontrado.");
        return;
      }
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al actualizar el préstamo.",
        this.getErrorMessage(error),
      );
    }
  };

  return = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idLoan, approved, status, notes } = req.body;
      const rs = await loanRepository.return(
        idLoan,
        (req as any).idUser,
        approved,
        status,
        notes || "",
      );
      if (!validate(rs)) {
        errorResponse(res, 404, "Préstamo no encontrado.");
        return;
      }
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al actualizar el préstamo.",
        this.getErrorMessage(error),
      );
    }
  };

  extend = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idLoan, returnDate, notes } = req.body;
      const rs = await loanRepository.extend(
        idLoan,
        (req as any).idUser,
        returnDate,
        notes,
      );
      if (!validate(rs)) {
        errorResponse(res, 404, "Préstamo no encontrado.");
        return;
      }
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al actualizar el préstamo.",
        this.getErrorMessage(error),
      );
    }
  };

  findOnePublic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req;
      if (!query || Object.keys(query).length === 0) {
        res.status(200).json({});
        return;
      }
      const rs = await loanRepository.findOne(query);
      if (!rs) {
        errorResponse(res, 404, "Préstamo no encontrado.");
        return;
      }
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al buscar el préstamo.",
        this.getErrorMessage(error),
      );
    }
  };
}

export const loanController = new LoanController();
