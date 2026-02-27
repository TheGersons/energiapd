import { Router } from "express";
import { roleController } from "@controller/role.controller";
import { validateToken } from "session";
import { hasPermission } from "middleware/permissions.middleware";

class RoleRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      "/",
      validateToken,
      hasPermission(["permisos:leer"]),
       roleController.findAll,
    );
    this.router.get("/one", roleController.findOne);
    this.router.post("/", roleController.create);
    this.router.put("/", roleController.update);
    this.router.delete("/", roleController.delete);
  }
}

export default new RoleRoute().router;
