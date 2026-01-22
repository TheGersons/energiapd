import { userController } from "@controller/user.controller";
import { Router } from "express";

class UserRoute {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/findAll", userController.findAll);
    this.router.post("/create", userController.create);
  }
}

export default new UserRoute().router;
