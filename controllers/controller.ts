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

  mapRoutes(router: Router) {
    this.routes.forEach((action, { method, path }) => {
      if (method === "get") {
        router.get(path, requestAction(action, this));
      }

      if (method === "delete") {
        router.delete(path, requestAction(action, this));
      }

      if (method === "post") {
        router.post(path, requestAction(action, this));
      }
    });
  }

  protected ok(data?: any) {
    this.status(Status.OK, data);
  }

  protected badRequest() {
    this.status(Status.BadRequest, { errorCode: "BadRequest" });
  }

  protected noContent() {
    this.status(Status.NoContent, {});
  }

  protected mapGet(path: string, action: Function) {
    this.routes.set({ method: "get", path }, action);
  }

  protected mapDelete(path: string, action: Function) {
    this.routes.set({ method: "delete", path }, action);
  }

  protected mapPost(path: string, action: Function) {
    this.routes.set({ method: "post", path }, action);
  }

  protected status(status: Status, body: any) {
    if (!this.ctx) return;

    this.ctx.response.body = body;
    this.ctx.response.status = status;    
  } 
}
