import { RouterContext, helpers, Status, Router } from "https://deno.land/x/oak/mod.ts";
import { AsyncControllerAction, RouteConfig } from "../infrastracture/mod.ts";
import authService from "../services/auth.service.ts";

function requestAction(route: RouteConfig, controller: Controller) {
  return  async function (ctx: RouterContext): Promise<void> {
    controller.ctx = ctx;
    let body;

    if (route.isAuth() || controller.useAuth) {
      const authResult = await authService.verifyAuthorization(ctx.request.headers.get("authorization") ?? "");
      if (!authResult.isSuccess) {
        ctx.response.status = Status.Forbidden;
        ctx.response.body = authResult;
        return;
      }
    }

    
    if (ctx.request.hasBody) {
      body = await ctx.request.body().value;
    }

    const asyncAction = <AsyncControllerAction>route.getAction();
    await asyncAction.call(controller, { ...helpers.getQuery(ctx, { mergeParams: true }), body });
  }
}

export class Controller {
  private readonly routes: RouteConfig[];
  private _useAuth: boolean;
  ctx: RouterContext | undefined;

  constructor() {
    this.routes = [];
    this._useAuth = false;
  }

  mapRoutes(router: Router) {
    this.routes.forEach(route => {
      if (route.isMethod("get")) {
        router.get(route.path, requestAction(route, this));
      }

      if (route.isMethod("delete")) {
        router.delete(route.path, requestAction(route, this));
      }

      if (route.isMethod("post")) {
        router.post(route.path, requestAction(route, this));
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
    const route = new RouteConfig(path);

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
