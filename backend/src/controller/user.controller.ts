import { Request, Response } from "express";
import { userRepository } from "repository/user.repository";
import { errorResponse } from "utils/errorResponse";

class UserController {
  private getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await userRepository.findAll();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener los usuarios.",
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
      const rs = await userRepository.findOne(query);
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al buscar el usuario.",
        this.getErrorMessage(error),
      );
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body?.user) {
        errorResponse(res, 400, "Los datos del usuario son requeridos.");
        return;
      }
      const rs = await userRepository.create(req.body.user);
      res.status(201).json(rs);
    } catch (error) {
      console.error("[UserController.create]", error);
      errorResponse(
        res,
        500,
        "Error al crear el usuario.",
        this.getErrorMessage(error),
      );
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { body } = req;
      if (!body?.user?.id) {
        errorResponse(res, 400, "El ID del usuario es requerido.");
        return;
      }
      const rs = await userRepository.update(body.user);
      res.status(200).json(rs);
    } catch (error) {
      console.error("[UserController.update]", error);
      errorResponse(
        res,
        500,
        "Error al actualizar el usuario.",
        this.getErrorMessage(error),
      );
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      if (
        !("idUser" in req.body) ||
        !("password" in req.body) ||
        !("requestChangePass" in req.body)
      ) {
        errorResponse(res, 400, "Campos faltantes");
        return;
      }

      const idUser = req.body.idUser || (req as any).idUser;

      const rs = await userRepository.changePassword(
        idUser,
        req.body.password,
        req.body.requestChangePass,
      );

      res.status(200).json(rs);
    } catch (error) {
      console.error("[UserController.changePassword]", error);
      errorResponse(
        res,
        500,
        "Error al cambiar contraseña.",
        this.getErrorMessage(error),
      );
    }
  };

  activeCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await userRepository.activeCount();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener conteo de activos.",
        this.getErrorMessage(error),
      );
    }
  };

  inactiveCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await userRepository.inactiveCount();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener conteo de inactivos.",
        this.getErrorMessage(error),
      );
    }
  };

  totalCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const rs = await userRepository.totalCount();
      res.status(200).json(rs);
    } catch (error) {
      errorResponse(
        res,
        500,
        "Error al obtener el total de usuarios.",
        this.getErrorMessage(error),
      );
    }
  };
}

export const userController = new UserController();
