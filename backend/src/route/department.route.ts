import { departmentController } from "@controller/department.controller";
import { Router } from "express";

class DepartmentRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/", departmentController.findAll);
    this.router.get("/One", departmentController.findOne);
    this.router.post("/", departmentController.create);
    this.router.put("/", departmentController.update);
  }
}

export default new DepartmentRoute().router;
