import { userController } from "@controller/user.controller";
import { Router } from "express";

class UserRoute {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", userController.findAll);
    this.router.get("/one", userController.findOne);
    this.router.post("/", userController.create);
    this.router.put("/", userController.update);
    this.router.get("/activeCount", userController.activeCount);
    this.router.get("/inactiveCount", userController.inactiveCount);
    this.router.get("/totalCount", userController.totalCount);
  }
}

export default new UserRoute().router;
