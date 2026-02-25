import { authController } from "@controller/auth.controller";
import { Router } from "express";

class AuthRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/", authController.authenticate);
  }
}

export default new AuthRoute().router;
