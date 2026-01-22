import { Request, Response } from "express";
import { productRepository } from "repository/product.repository";

class ProductController {
  async create(req: Request, res: Response) {
    productRepository
      .create(req.body.product)
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(400).json(error));
  }

  async findAll(req: Request, res: Response) {
    productRepository
      .findAll()
      .then((rs) => res.status(200).json(rs))
      .catch((error) => res.status(400).json(error));
  }
}

export const productController = new ProductController();
