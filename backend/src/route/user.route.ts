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
    this.router.get("/", userController.findAll);
    this.router.get(
      "/one",
      validateToken,
      hasPermission(["usuarios:leer"]),
      userController.findOne,
    );
    this.router.post("/", userController.create);
    this.router.put("/", userController.update);
    this.router.get("/activeCount", userController.activeCount);
    this.router.get("/inactiveCount", userController.inactiveCount);
    this.router.get("/totalCount", userController.totalCount);
  }
}

export default new UserRoute().router;
