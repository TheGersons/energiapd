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
      hasPermission(["pestamo-herramientas:leer"]),
      loanController.findAll,
    );
    this.router.get(
      "/one",
      validateToken,
      hasPermission(["pestamo-herramientas:leer"]),
      loanController.findOne,
    );
    this.router.post("/", validateToken, loanController.create);
    this.router.put("/", loanController.update);
  }
}

export default new LoanRoute().router;
