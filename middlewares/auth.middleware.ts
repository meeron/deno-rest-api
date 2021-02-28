import { RouterContext, Status } from "https://deno.land/x/oak/mod.ts";
import authService from "../services/auth.service.ts";

export default async function authMiddleware(ctx: RouterContext, next: Function) {
  const headerValue = ctx.request.headers.get("authorization") ?? "";
  const authResult = await authService.verifyAuthorization(headerValue);

  if (!authResult.isSuccess) {
    ctx.response.status = Status.Forbidden;
    ctx.response.body = authResult;
    return;
  }

  await next();
}
