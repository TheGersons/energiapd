import { Router } from "express";
import { loanController } from "@controller/loan.controller";

class LoanRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/", loanController.findAll);
    this.router.get("/one", loanController.findOne);
    this.router.post("/", loanController.create);
    this.router.put("/", loanController.update);
  }
}

export default new LoanRoute().router;
