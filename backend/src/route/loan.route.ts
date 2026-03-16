import { Router } from "express";
import { loanController } from "@controller/loan.controller";
import { hasPermission } from "middleware/permissions.middleware";
import { validateToken } from "session";

class LoanRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get(
      "/",
      validateToken,
      hasPermission(["prestamo-herramientas:leer"]),
      loanController.findAll,
    );
    this.router.get(
      "/one",
      validateToken,
      hasPermission(["prestamo-herramientas:leer:uno"]),
      loanController.findOne,
    );
    this.router.post("/", loanController.create);
    this.router.put("/", loanController.update);
    this.router.patch(
      "/",
      validateToken,
      hasPermission(["prestamo-herramientas:autorizar"]),
      loanController.approve,
    );
  }
}

export default new LoanRoute().router;
