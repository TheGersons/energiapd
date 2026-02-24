import { Router } from "express";
import { loanController } from "@controller/loan.controller";
import { hasPermission } from "middleware/permissions.middleware";

class LoanRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      "/",
      hasPermission([
        "inventario-herramienta:leer:todas",
        "inventario-herramienta:leer:propias",
      ]),
      loanController.findAll,
    );
    this.router.get(
      "/one",
      hasPermission([
        "inventario-herramienta:leer:todas",
        "inventario-herramienta:leer:propias",
      ]),
      loanController.findOne,
    );
    this.router.post("/", loanController.create);
    this.router.put("/", loanController.update);
  }
}

export default new LoanRoute().router;
