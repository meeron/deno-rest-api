import { helpers, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { Controller } from "../controllers/controller.ts";
import { AsyncControllerAction } from "./mod.ts";
import { ControllerAction } from "./mod.ts";
import { HttpMethod } from "./mod.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

export type ActionMiddleware = (ctx: RouterContext, next: Function) => Promise<void>;

export class RouteConfig {
  private method: HttpMethod;
  private actionMiddlewares: ActionMiddleware[];

  constructor(
    private readonly controller: Controller,
    public readonly path: string) {
    this.method = "get";
    this.actionMiddlewares = [];
  }

  post() {
    this.method = "post";
    return this;
  }

  delete() {
    this.method = "delete";
    return this;
  }

  use(action: ControllerAction | AsyncControllerAction) {
    this.actionMiddlewares.push(async (ctx: RouterContext, next: Function) => {
      this.controller.ctx = ctx;

      let body;
      if (ctx.request.hasBody) {
        body = await ctx.request.body().value;
      }
  
      const asyncAction = <AsyncControllerAction>action;
      await asyncAction.call(this.controller, { ...helpers.getQuery(ctx, { mergeParams: true }), body });
  
      await next();
    });
    return this;
  }

  useAuth() {
    this.actionMiddlewares.push(authMiddleware);
    return this;
  }

  isMethod(method: HttpMethod) {
    return this.method == method;
  }

  getMiddlewares() {
    return this.actionMiddlewares;
  }
}
