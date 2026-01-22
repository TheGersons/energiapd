import { Router } from "express";
import { productController } from "@controller/product.controller";

class ProductRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post("/create", productController.create);
    this.router.get("/findAll", productController.findAll);
  }
}

export default new ProductRoute().router;
