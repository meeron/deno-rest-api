import { RouterContext, helpers, Status, Router } from "https://deno.land/x/oak/mod.ts";

function requestAction(action: Function, controller: Controller) {
  return function (ctx: RouterContext): void {
    controller.ctx = ctx;    

    action.call(controller, helpers.getQuery(ctx, { mergeParams: true }));
  }
}

export class Controller {
  private readonly routes: Map<{method: string, path: string}, Function>;
  ctx: RouterContext | undefined;

  constructor() {
    this.routes = new Map<{method: string, path: string}, Function>();
  }

  protected ok(data: any) {
    if (this.ctx) {
      this.ctx.response.body = data;
    }
  }

  protected badRequest() {
    if (!this.ctx) return;

    this.ctx.response.body = { errorCode: "BadRequest" };
    this.ctx.response.status = Status.BadRequest;
  }

  protected mapGet(path: string, action: Function) {
    this.routes.set({ method: "get", path }, action);
  }

  mapRoutes(router: Router) {
    this.routes.forEach((action, { method, path }) => {
      if (method === "get") {
        router.get(path, requestAction(action, this));
      }
    });
  }
}
