import { RouterContext, Status, Router } from "https://deno.land/x/oak/mod.ts";
import { RouteConfig, ActionMiddleware } from "../infrastracture/mod.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

export class Controller {
  private readonly routes: RouteConfig[];
  private readonly middlewares: ActionMiddleware[];
  ctx?: RouterContext;

  constructor() {
    this.routes = [];
    this.middlewares = [];
  }

  mapRoutes(router: Router) {
    this.routes.forEach(route => {
      const middlewares = [
        ...this.middlewares,
        ...route.getMiddlewares(),
      ];

      if (route.isMethod("get")) {
        router.get(route.path, ...middlewares);
      }

      if (route.isMethod("delete")) {
        router.delete(route.path, ...middlewares);
      }

      if (route.isMethod("post")) {
        router.post(route.path, ...middlewares);
      }
    });
  }

  protected useAuth() {
    this.middlewares.push(authMiddleware);
  }

  protected route(path: string) {
    const route = new RouteConfig(this, path);

    this.routes.push(route);

    return route;
  }

  protected ok(data?: any) {
    this.status(Status.OK, data);
  }

  protected badRequest(errorCode?: string, message?: string) {
    this.status(Status.BadRequest, { errorCode: errorCode ?? "BadRequest", message });
  }

  protected badRequestObject(data: any) {
    this.status(Status.BadRequest, data);
  }

  protected noContent() {
    this.status(Status.NoContent, {});
  }

  protected created(data?: any) {
    this.status(Status.Created, data);
  }

  protected status(status: Status, body: any) {
    if (!this.ctx) return;

    this.ctx.response.body = body;
    this.ctx.response.status = status;    
  } 
}
