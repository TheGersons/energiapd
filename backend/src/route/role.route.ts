import { Router } from "express";
import { roleController } from "@controller/role.controller";

class RoleRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/findAll", roleController.findAll);
    this.router.post("/create", roleController.create);
    this.router.put("/update", roleController.update);
    this.router.delete("/delete", roleController.delete);
  }
}

export default new RoleRoute().router;
