export interface Product {
  _id: number,
  name: string,
  description: string,
  price: number,
}

const products: Product[] = [
  {
    _id: 1,
    name: "Orange",
    description: "Some nice orange",
    price: 4.99,
  },
  {
    _id: 2,
    name: "Witcher 3",
    description: "XBox One game",
    price: 24.99,
  },
  {
    _id: 3,
    name: "XBox Series X",
    description: "Gaming console from Microsoft",
    price: 599.99,
  }
];

export interface IProductsRepository {
  find(): Promise<Product[]>,
  findOne(predicate: (p: Product) => boolean): Promise<Product | undefined>,
  insert(newProduct: Product): Promise<Product>,
  delete(id: number): Promise<number>,
}

class ProductsRepository implements IProductsRepository {
  insert(newProduct: Product): Promise<Product> {
    newProduct._id = Date.now(),

    products.push(newProduct);

    return new Promise(r => r(newProduct));
  }

  delete(id: number): Promise<number> {
    const index = products.findIndex(p => p._id == id);
    const result = index > -1 ? 1 : 0;

    if (result > 0) {
      products.splice(index, 1);
    }

    return new Promise(r => r(result));
  }

  findOne(predicate: (p: Product) => boolean): Promise<Product | undefined> {
    return new Promise(r => r(products.find(predicate)));
  }

  find(): Promise<Product[]> {
    return new Promise(r => r(products));
  }
}

const repository: IProductsRepository = new ProductsRepository();

export default repository;
