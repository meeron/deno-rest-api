import { RouterContext, helpers, Status, Router } from "https://deno.land/x/oak/mod.ts";
import authService from "../services/auth.service.ts";

type AsyncControllerAction = (params: Record<string, any>) => Promise<void>;
type ControllerAction = (params: Record<string, any>) => void;
type HttpMethod = "get" | "post" | "delete";
interface MapOptions {
  method: HttpMethod,
  path: string,
  useAuth: boolean,
}

function requestAction(action: ControllerAction | AsyncControllerAction, controller: Controller, useAuth: boolean) {
  return  async function (ctx: RouterContext): Promise<void> {
    controller.ctx = ctx;
    let body;

    if (useAuth || controller.useAuth) {
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

    const asyncAction = <AsyncControllerAction>action;
    await asyncAction.call(controller, { ...helpers.getQuery(ctx, { mergeParams: true }), body });
  }
}

export class Controller {
  private readonly routes: Map<MapOptions, ControllerAction | AsyncControllerAction>;
  private _useAuth: boolean;
  ctx: RouterContext | undefined;

  constructor() {
    this.routes = new Map<MapOptions, ControllerAction | AsyncControllerAction>();
    this._useAuth = false;
  }

  mapRoutes(router: Router) {
    this.routes.forEach((action, { method, path, useAuth }) => {
      if (method === "get") {
        router.get(path, requestAction(action, this, useAuth));
      }

      if (method === "delete") {
        router.delete(path, requestAction(action, this, useAuth));
      }

      if (method === "post") {
        router.post(path, requestAction(action, this, useAuth));
      }
    });
  }

  get useAuth() {
    return this._useAuth;
  }

  protected setAuth() {
    this._useAuth = true;
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

  protected mapGet(path: string, action: ControllerAction | AsyncControllerAction, useAuth: boolean = false) {
    this.routes.set({ method: "get", path, useAuth }, action);
  }

  protected mapDelete(path: string, action: ControllerAction | AsyncControllerAction, useAuth: boolean = false) {
    this.routes.set({ method: "delete", path, useAuth }, action);
  }

  protected mapPost(path: string, action: ControllerAction | AsyncControllerAction, useAuth: boolean = false) {
    this.routes.set({ method: "post", path, useAuth }, action);
  }

  protected status(status: Status, body: any) {
    if (!this.ctx) return;

    this.ctx.response.body = body;
    this.ctx.response.status = status;    
  } 
}
