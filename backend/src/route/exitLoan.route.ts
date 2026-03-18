import { exitLoanController } from "@controller/exitLoan.controller";
import { Router } from "express";

class ExitRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/", exitLoanController.register);
    this.router.get("/", exitLoanController.findByLoan);
  }
}

export default new ExitRoute().router;
