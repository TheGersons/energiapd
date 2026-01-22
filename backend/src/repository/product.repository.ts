import { ProductModel } from "@model/product.model";
import { IProduct } from "@type/product.type";

class ProductRepository {
  async create(product: IProduct) {
    return await ProductModel.create(product);
  }

  async findAll() {
    return await ProductModel.findAll();
  }

  async findOne() {
    return await ProductModel.findOne();
  }
}

export const productRepository = new ProductRepository();
