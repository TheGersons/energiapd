import { Request, Response, NextFunction } from "express";
import prisma from "@database/index";
import { errorResponse } from "utils/errorResponse";

export interface AuthRequest extends Request {
  idUser?: string;
  permissions?: string[];
}

export function hasPermission(requiredPermissions: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.idUser || !req.permissions) {
        errorResponse(
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
        errorResponse(res, 403, "No tiene permisos para realizar esta acción");
      }

      next();
    } catch (error) {
      console.error("[authorize middleware]", error);
      errorResponse(res, 500, "Error verificando permisos");
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
                idUser: "d098bb3b-ff0c-45f0-aa7c-c72a0213540b",
              },
            },
          },
        },
      },
    },
  });

  return rsS.flatMap((a) => [a.slug]);
};
