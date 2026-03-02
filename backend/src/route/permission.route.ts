import { Router } from "express";
import { permissionController } from "@controller/permission.controller";
import { validateToken } from "session";

class PermissionRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/catalog", permissionController.findAll);

    this.router.get("/one", validateToken, permissionController.findOne);
  }
}

export default new PermissionRoute().router;
