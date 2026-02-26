import { Request, Response, NextFunction } from "express";
import prisma from "@database/index";
import { errorResponse } from "utils/errorResponse";

export interface AuthRequest extends Request {
  idUser?: string;
}

export function hasPermission(requiredPermissions: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.idUser) {
        return errorResponse(
          res,
          401,
          "Debe iniciar sesión para acceder a este recurso.",
        );
      }

      const userPermissions = await findPermissions(req.idUser ?? "");

      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.includes(perm),
      );

      if (!hasPermission) {
        return errorResponse(
          res,
          403,
          "No tiene permisos para realizar esta acción",
        );
      }

      next();
    } catch (error) {
      console.error("[authorize middleware]", error);
      return errorResponse(res, 500, "Error verificando permisos");
    }
  };
}

const findPermissions = async (idUser: string): Promise<string[]> => {
  const rsS = await prisma.permission.findMany({
    where: {
      rolePermissions: {
        some: {
          role: {
            userRoles: {
              some: {
                idUser,
              },
            },
          },
        },
      },
    },
  });

  return rsS.flatMap((a) => [a.slug]);
};
