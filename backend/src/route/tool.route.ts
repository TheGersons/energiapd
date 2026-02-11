import { Router } from "express";
import { toolController } from "@controller/tool.controller";

import multer from "multer";

class ToolRoute {
  router: Router;
  upload = multer({
    dest: "uploads/tools/",
  });

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/", toolController.findAll);
    this.router.get("/one", toolController.findOne);
    this.router.post("/", this.upload.single("img"), toolController.create);
    this.router.put("/", toolController.update);
  }
}

export default new ToolRoute().router;
