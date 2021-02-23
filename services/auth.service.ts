import { 
  CreateTokenRequest,
  CreateTokenResult,
  OAuth2ErrorType,
  Token,
 } from "../models/auth.models.ts";
 import { create } from "https://deno.land/x/djwt@v2.2/mod.ts";

 const clients = [
  { id: "W0itmV1LG5inBb0g", secret: "a9QG9PNGKdX9LqJ3z52fVlWS" },
  { id: "DRWGyVbbbEKp21Tz", secret: "tAXUKtO48A0yp66SCxiHCDKO" },
 ];

export interface IAuthService {
  createToken(request: CreateTokenRequest): Promise<CreateTokenResult>,
}

class AuthService implements IAuthService {
  
  async createToken(request: CreateTokenRequest): Promise<CreateTokenResult> {
    const error = this.validateRequest(request);
    if (error) {
      return new Promise(r => r({ error: { error } }));
    }

    const client = clients.find(c => c.id === request.client_id && c.secret === request.client_secret);
    if (!client) {
      return new Promise(r => r({ error: { error: "invalid_client" } }));
    }

    const expiresIn = 3600;
    const jwt = await create(
      { alg: "HS512", typ: "JWT" },
      { sub: client.id, exp: Date.now() + expiresIn },
      Deno.env.get("JWT_SECRET")!
    );

    const token: Token = {
      access_token: jwt,
      expires_in: expiresIn,
      token_type: "Bearer",
    };

    return new Promise(r => r({ token }));
  }

  private validateRequest(request: CreateTokenRequest): OAuth2ErrorType | undefined {
    if (!request.grant_type) {
      return "invalid_request";
    }

    if (request.grant_type != "client_credentials") {
      return "unsupported_grant_type";
    }

    if (!request.client_id) {
      return "invalid_request";
    }

    if (!request.client_secret) {
      return "invalid_request";
    }
    
    return;
  }
}

const service: IAuthService = new AuthService();

export default service;
