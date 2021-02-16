import { Router } from "https://deno.land/x/oak/mod.ts";
import home from "./controllers/home.controller.ts";

const router = new Router();

home.mapRoutes(router);

export default router;
