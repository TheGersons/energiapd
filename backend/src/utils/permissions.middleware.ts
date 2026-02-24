import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar permisos
 * @param {string|string[]} requiredPermissions
 */
const authorize = (requiredPermissions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id; // Del token JWT

      // Obtener permisos del usuario
      const userPermissions = await getUserPermissions(userId);

      // Convertir a array si es string
      const required = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      // Verificar si tiene al menos uno de los permisos requeridos
      const hasPermission = required.some((perm) =>
        userPermissions.includes(perm),
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "No tienes permisos para realizar esta acción",
          required: required,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error verificando permisos" });
    }
  };
};

/**
 * Obtener todos los permisos de un usuario
 * (a través de sus roles)
 */
async function getUserPermissions(userId: string) {
  const query = `
    SELECT DISTINCT p.name
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    INNER JOIN user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = $1
  `;

  const result = await db.query(query, [userId]);
  return result.rows.map((row) => row.name);
}

module.exports = { authorize, getUserPermissions };
