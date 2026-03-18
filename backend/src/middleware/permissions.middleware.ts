import { Request, Response, NextFunction } from "express";
import prisma from "@database/index";
import { errorResponse } from "utils/errorResponse";

export interface AuthRequest extends Request {
  idUser?: string;
}

export function hasPermission(requiredPermissions: string[]) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.idUser) {
        errorResponse(
          res,
          401,
          "Debe iniciar sesión para acceder a este recurso.",
        );
        return;
      }

      const userPermissions = await findPermissions(req.idUser);

      const authorized = requiredPermissions.some((perm) =>
        userPermissions.includes(perm),
      );

      if (!authorized) {
        errorResponse(res, 403, "No tiene permisos para realizar esta acción");
        return;
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
                idUser,
              },
            },
          },
        },
      },
    },
    select: {
      slug: true,
    },
  });

  return rsS.map((a) => a.slug);
};
