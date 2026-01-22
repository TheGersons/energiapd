import { moduleController } from "@controller/module.controller";
import { Router } from "express";

class ModuleRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/findAllWithPages", moduleController.findAllWithPages);
    this.router.post("/create", moduleController.create);
    this.router.put("/update", moduleController.update);
    this.router.delete("/delete", moduleController.delete);
  }
}

export default new ModuleRoute().router;
