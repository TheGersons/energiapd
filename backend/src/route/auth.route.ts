import { authController } from "@controller/auth.controller";
import { Router } from "express";
import { validateToken } from "session";

class AuthRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/", authController.authenticate);
    this.router.get("/check", validateToken, (req, res) => {
      res.status(200).json({ ok: true });
    });
    this.router.post("/refresh", authController.refreshToken);
  }
}

export default new AuthRoute().router;
