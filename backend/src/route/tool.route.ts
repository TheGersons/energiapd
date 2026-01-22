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
    this.router.get("/tools", toolController.findAll);
    this.router.get("/tool", toolController.findOne);
    this.router.post("/tool", this.upload.single("img"), toolController.create);
    this.router.put("/tool", toolController.update);
  }
}

export default new ToolRoute().router;
