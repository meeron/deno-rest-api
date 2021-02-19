import { CreateTokenRequest } from "../models/auth.models.ts";
import authService, { IAuthService } from "../services/auth.service.ts";
import { Controller } from "./controller.ts";

class AuthController extends Controller {
  constructor(private readonly authService: IAuthService) {
    super();

    this.mapPost("/auth/token", this.createToken);
  }

  async createToken(request: Record<string, any>) {
    const result = await this.authService.createToken(<CreateTokenRequest>request);
    
    if (result.error) return this.badRequestObject(result.error);
    
    this.ok();
  }
}

const controller = new AuthController(authService);

export default controller;
