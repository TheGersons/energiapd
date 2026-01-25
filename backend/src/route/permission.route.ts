import { Router } from "express";
import { permissionController } from "@controller/permission.controller";

class PermissionRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/catalog", permissionController.findAll);
  }
}

export default new PermissionRoute().router;
