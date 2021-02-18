import { NewProductRequest, NewProductResult, ProductViewModel } from "../models/products.models.ts";
import repository, { IProductsRepository, Product } from "../repositories/products.repository.ts";

export interface IProductsService {
  getAll(): Promise<ProductViewModel[]>,
  getById(id: number): Promise<ProductViewModel | undefined>,
  delete(id: number): Promise<boolean>,
  addProduct(request: NewProductRequest): Promise<NewProductResult>,
}

class ProductsService implements IProductsService {
  
  constructor(private readonly repository: IProductsRepository) {

  }

  async addProduct(request: NewProductRequest): Promise<NewProductResult> {

    if (!request.name) {
      return { errorMessage: "'name' is required" };
    }

    if (isNaN(+request.price)) {
      return { errorMessage: "'price' is invalid" };
    }

    const newProduct: Product = {
      _id: 0,
      name: request.name,
      description: request.description,
      price: request.price,
    };

    return {
      newProduct: this.map(await this.repository.insert(newProduct)),
    };
  }

  async delete(id: number): Promise<boolean> {
    return await this.repository.delete(id) > 0;
  }
  
  async getById(id: number): Promise<ProductViewModel | undefined> {
    const product = await this.repository.findOne(p => p._id == id);
    if (!product) return;

    return this.map(product);
  }
  
  async getAll(): Promise<ProductViewModel[]> {
    const products = await this.repository.find();

    return products.map(this.map);
  }

  private map(product: Product): ProductViewModel {
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
    };
  }
}

const service: IProductsService = new ProductsService(repository);

export default service;
