import { userController } from "@controller/user.controller";
import { Router } from "express";
import { hasPermission } from "middleware/permissions.middleware";
import { validateToken } from "session";

class UserRoute {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      validateToken,
      hasPermission(["usuarios:leer"]),
      userController.findAll,
    );
    this.router.get(
      "/one",
      validateToken,
      hasPermission(["usuarios:leer"]),
      userController.findOne,
    );
    this.router.post(
      "/",
      validateToken,
      hasPermission(["usuarios:crear"]),
      userController.create,
    );
    this.router.put(
      "/",
      validateToken,
      hasPermission(["usuarios:editar"]),
      userController.update,
    );
    this.router.patch(
      "/",
      validateToken,
      hasPermission(["usuarios:editar"]),
      userController.changePassword,
    );
    this.router.get(
      "/activeCount",
      validateToken,
      hasPermission(["usuarios:leer"]),
      userController.activeCount,
    );
    this.router.get(
      "/inactiveCount",
      validateToken,
      hasPermission(["usuarios:leer"]),
      userController.inactiveCount,
    );
    this.router.get(
      "/totalCount",
      validateToken,
      hasPermission(["usuarios:leer"]),
      userController.totalCount,
    );
  }
}

export default new UserRoute().router;
