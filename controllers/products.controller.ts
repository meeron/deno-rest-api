import productsService, { IProductsService } from "../services/products.service.ts";
import { Controller } from "./controller.ts";

class ProductsController extends Controller {
  constructor(
    private readonly productsService: IProductsService
  ) {
    super();

    this.useAuth();
    this.route("/products").use(this.getAll);
    this.route("/products/:id").use(this.getById);
    this.route("/products/:id").use(this.delete).delete();
    this.route("/products").use(this.create).post();
  }

  async getAll() {
    this.ok(await this.productsService.getAll());
  }

  async getById({ id }: Record<string, any>) {
    const product = await this.productsService.getById(+id);
    if (!product) return this.noContent();

    this.ok(product);
  }

  async delete({ id }: Record<string, any>) {
    if (!await this.productsService.delete(+id)) {
      return this.noContent();
    }

    this.ok();
  }

  async create({ body }: Record<string, any>) {
    const result = await this.productsService.addProduct(body);
    if (result.errorMessage) return this.badRequest("InvalidInput", result.errorMessage);

    this.created(result.newProduct);
  }
}

const products = new ProductsController(productsService);

export default products;
