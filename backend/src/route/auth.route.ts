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
    this.router.post("/refresh", authController.refreshToken);
  }
}

export default new AuthRoute().router;
