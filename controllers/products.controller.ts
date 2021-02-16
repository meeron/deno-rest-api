import { Product } from "../contracts/products.ts";
import { Controller } from "./controller.ts";

const data: Product[] = [
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

class ProductsController extends Controller {
  constructor() {
    super();

    this.mapGet("/products", this.getAll);
    this.mapGet("/products/:id", this.getById);
    this.mapDelete("/products/:id", this.delete);
  }

  getAll() {
    this.ok(data);
  }

  getById({ id }: Record<string, string>) {
    const product = data.find(p => p.id === +id);
    if (!product) return this.noContent();

    this.ok(product);
  }

  delete({ id }: Record<string, string>) {
    const index = data.findIndex(p => p.id === +id);
    if (index === -1) return this.noContent();

    data.splice(index, 1);

    this.ok();
  }

  create() {
  }
}

const products = new ProductsController();

export default products;
