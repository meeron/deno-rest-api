import { RouterContext, Status, Router } from "https://deno.land/x/oak/mod.ts";
import { RouteConfig } from "../infrastracture/mod.ts";

export class Controller {
  private readonly routes: RouteConfig[];
  private _useAuth: boolean;
  ctx?: RouterContext;

  constructor() {
    this.routes = [];
    this._useAuth = false;
  }

  mapRoutes(router: Router) {
    this.routes.forEach(route => {
      if (route.isMethod("get")) {
        router.get(route.path, ...route.getMiddlewares());
      }

      if (route.isMethod("delete")) {
        router.delete(route.path, ...route.getMiddlewares());
      }

      if (route.isMethod("post")) {
        router.post(route.path, ...route.getMiddlewares());
      }
    });
  }

  get useAuth() {
    return this._useAuth;
  }

  protected withAuth() {
    this._useAuth = true;
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
