import { Router } from "https://deno.land/x/oak/mod.ts";
import home from "./controllers/home.controller.ts";
import products from "./controllers/products.controller.ts";
import produdcts from "./controllers/products.controller.ts";

const router = new Router();

home.mapRoutes(router);
products.mapRoutes(router);

export default router;
