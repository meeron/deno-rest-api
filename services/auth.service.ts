import { 
  CreateTokenRequest,
  CreateTokenResult,
  OAuth2ErrorType,
  OAuth2TokenType,
  Token,
 } from "../models/auth.models.ts";
import { create, Payload, verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { Result } from "../models/common.models.ts";
import { Algorithm } from "https://deno.land/x/djwt@v2.2/algorithm.ts";

 const clients = [
  { id: "W0itmV1LG5inBb0g", secret: "a9QG9PNGKdX9LqJ3z52fVlWS" },
  { id: "DRWGyVbbbEKp21Tz", secret: "tAXUKtO48A0yp66SCxiHCDKO" },
 ];

export interface IAuthService {
  createToken(request: CreateTokenRequest): Promise<CreateTokenResult>,
  verifyAuthorization(headerValue: string): Promise<Result<Payload>>,
}

class AuthService implements IAuthService {
  private readonly secret: string;
  private readonly alg: Algorithm;

  constructor() {
    this.secret = Deno.env.get("JWT_SECRET")!;
    this.alg = "HS512";
  }

  async verifyAuthorization(headerValue: string): Promise<Result<Payload>> {
    const headerValueSplit = headerValue.split(' ');
    const authScheme = headerValueSplit[0] as OAuth2TokenType;
    const authValue = headerValueSplit[1];
    
    if (authScheme != "Bearer") return Result.forbidden("Invalid authentication scheme");

    try {
      const payload = await verify(authValue, this.secret, this.alg);

      if (Date.now() > payload.exp!) return Result.forbidden("Token has expired");
      
      return Result.success(payload);
    } catch {
      return Result.forbidden();
    }
  }
  
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
      { alg: this.alg, typ: "JWT" },
      { sub: client.id, exp: Date.now() + (expiresIn * 1000) },
      this.secret
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
