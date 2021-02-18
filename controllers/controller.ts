import { RouterContext, helpers, Status, Router } from "https://deno.land/x/oak/mod.ts";

type AsyncControllerAction = (params: Record<string, any>) => Promise<void>;
type ControllerAction = (params: Record<string, any>) => void;

function requestAction(action: ControllerAction | AsyncControllerAction, controller: Controller) {
  return  async function (ctx: RouterContext): Promise<void> {
    controller.ctx = ctx;
    let body;
    
    if (ctx.request.hasBody) {
      body = await ctx.request.body().value;
    }

    const asyncAction = <AsyncControllerAction>action;
    await asyncAction.call(controller, { ...helpers.getQuery(ctx, { mergeParams: true }), body });
  }
}

export class Controller {
  private readonly routes: Map<{method: string, path: string}, ControllerAction | AsyncControllerAction>;
  ctx: RouterContext | undefined;

  constructor() {
    this.routes = new Map<{method: string, path: string}, ControllerAction | AsyncControllerAction>();
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

  protected badRequest(errorCode?: string, message?: string) {
    this.status(Status.BadRequest, { errorCode: errorCode ?? "BadRequest", message });
  }

  protected noContent() {
    this.status(Status.NoContent, {});
  }

  protected created(data?: any) {
    this.status(Status.Created, data);
  }

  protected mapGet(path: string, action: ControllerAction | AsyncControllerAction) {
    this.routes.set({ method: "get", path }, action);
  }

  protected mapDelete(path: string, action: ControllerAction | AsyncControllerAction) {
    this.routes.set({ method: "delete", path }, action);
  }

  protected mapPost(path: string, action: ControllerAction | AsyncControllerAction) {
    this.routes.set({ method: "post", path }, action);
  }

  protected status(status: Status, body: any) {
    if (!this.ctx) return;

    this.ctx.response.body = body;
    this.ctx.response.status = status;    
  } 
}
