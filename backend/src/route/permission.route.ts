import { Router } from "express";
import { permissionController } from "@controller/permission.controller";

class PermissionRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/findAll", permissionController.findAll);
    this.router.get("/findPermissionsByRole", permissionController.findPermissionsByRole);
  }
}

export default new PermissionRoute().router;
