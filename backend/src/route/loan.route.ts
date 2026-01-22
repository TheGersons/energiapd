import { Router } from "express";
import { loanController } from "@controller/loan.controller";

class LoanRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/loans", loanController.findAll);
    this.router.get("/loan", loanController.findOne);
    this.router.post("/loan", loanController.create);
    this.router.put("/loan", loanController.update);
  }
}

export default new LoanRoute().router;
