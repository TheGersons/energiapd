import { Router } from "express";
import { toolController } from "@controller/tool.controller";

import multer from "multer";
import { hasPermission } from "middleware/permissions.middleware";
import { validateToken } from "session";

class ToolRoute {
  router: Router;
  upload = multer({ storage: multer.memoryStorage() });

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      "/",
      validateToken,
      hasPermission([
        "inventario-herramienta:leer:todas",
        "inventario-herramienta:leer:propias",
      ]),
      toolController.findAll,
    );
    this.router.get("/one", toolController.findOne);
    this.router.post("/", this.upload.single("image"), toolController.create);
    this.router.put("/", this.upload.single("image"), toolController.update);
    this.router.delete("/", toolController.delete);
  }
}

export default new ToolRoute().router;
