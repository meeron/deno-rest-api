import { AsyncControllerAction } from "./mod.ts";
import { ControllerAction } from "./mod.ts";
import { HttpMethod } from "./mod.ts";

export class RouteConfig {
  private method: HttpMethod;
  private action?: ControllerAction | AsyncControllerAction;
  private useAuth: boolean;

  constructor(public readonly path: string) {
    this.method = "get";
    this.useAuth = false;
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
    this.action = action;
    return this;
  }

  withAuth() {
    this.useAuth = true;
    return this;
  }

  isMethod(method: HttpMethod) {
    return this.method == method;
  }

  getAction() {
    return this.action;
  }

  isAuth() {
    return this.useAuth;
  }
}
