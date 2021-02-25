import { CreateTokenRequest } from "../models/auth.models.ts";
import authService, { IAuthService } from "../services/auth.service.ts";
import { Controller } from "./controller.ts";

class AuthController extends Controller {
  constructor(private readonly authService: IAuthService) {
    super();

    this.route("/auth/token").use(this.createToken).post();
  }

  async createToken({ body }: Record<string, any>) {
    const result = await this.authService.createToken(<CreateTokenRequest>body);
    
    if (result.error) return this.badRequestObject(result.error);
    
    this.ok(result.token);
  }
}

const controller = new AuthController(authService);

export default controller;
