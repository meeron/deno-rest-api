import { NewProductRequest, NewProductResult, ProductViewModel } from "../models/products.models.ts";

const products: ProductViewModel[] = [
  {
    id: 1,
    name: "Orange",
    description: "Some nice orange",
    price: 4.99,
  },
  {
    id: 2,
    name: "Witcher 3",
    description: "XBox One game",
    price: 24.99,
  },
  {
    id: 3,
    name: "XBox Series X",
    description: "Gaming console from Microsoft",
    price: 599.99,
  }
];

export interface IProductsService {
  getAll(): Promise<ProductViewModel[]>,
  getById(id: number): Promise<ProductViewModel | undefined>,
  delete(id: number): Promise<boolean>,
  addProduct(request: NewProductRequest): Promise<NewProductResult>,
}

class ProductsService implements IProductsService {
  
  addProduct(request: NewProductRequest): Promise<NewProductResult> {

    if (!request.name) {
      return new Promise(resolve => resolve({ errorMessage: "'name' is required" }));
    }

    if (isNaN(+request.price)) {
      return new Promise(resolve => resolve({ errorMessage: "'price' is invalid" }));
    }

    const newProduct: ProductViewModel = {
      id: products.length + 1,
      name: request.name,
      description: request.description,
      price: request.price,
    };

    products.push(newProduct);

    return new Promise(resolve => resolve({ newProduct }));
  }

  delete(id: number): Promise<boolean> {
    const index = products.findIndex(p => p.id == id);
    const result = index > -1;

    if (result) {
      products.splice(index, 1);
    }
    
    return new Promise(resolve => resolve(result));
  }
  
  getById(id: number): Promise<ProductViewModel | undefined> {
    const product = products.find(p => p.id == id);

    return new Promise((resolve) => resolve(product));
  }
  
  getAll(): Promise<ProductViewModel[]> {
    return new Promise((resolve) => resolve(products));
  }
}

const service: IProductsService = new ProductsService();

export default service;
