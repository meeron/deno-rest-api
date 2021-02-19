import { CreateTokenRequest, CreateTokenResult, Token } from "../models/auth.models.ts";

export interface IAuthService {
  createToken(request: CreateTokenRequest): Promise<CreateTokenResult>,
}

class AuthService implements IAuthService {
  
  createToken(request: CreateTokenRequest): Promise<CreateTokenResult> {
    const token: Token = {
      access_token: "2YotnFZFEjr1zCsicMWpAA",
      token_type: "Bearer",
      expires_in: 3600,
    };

    return new Promise(r => r({ error: { error: "invalid_request" } }));
  }
}

const service: IAuthService = new AuthService();

export default service;
