import { Router } from "express";
import { roleController } from "@controller/role.controller";

class RoleRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/", roleController.findAll);
    this.router.get("/one", roleController.findOne);
    this.router.post("/", roleController.create);
    this.router.put("/", roleController.update);
  }
}

export default new RoleRoute().router;
