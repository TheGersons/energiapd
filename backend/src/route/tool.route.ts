import { Router } from "express";
import { toolController } from "@controller/tool.controller";

import multer from "multer";

class ToolRoute {
  router: Router;
  upload = multer({ storage: multer.memoryStorage() });

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/", toolController.findAll);
    this.router.get("/one", toolController.findOne);
    this.router.post("/", this.upload.single("image"), toolController.create);
    this.router.put("/", this.upload.single("image"), toolController.update);
    this.router.delete("/", toolController.delete);
  }
}

export default new ToolRoute().router;
