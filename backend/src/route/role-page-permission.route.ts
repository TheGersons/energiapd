import { rolePagePermissionController } from "@controller/role-page-permission.controller";
import { Router } from "express";

class RolePagePermissionRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post("/create", rolePagePermissionController.create);
    this.router.put("/update", rolePagePermissionController.update);
    this.router.delete("/delete", rolePagePermissionController.delete);
  }
}

export default new RolePagePermissionRoute().router;
