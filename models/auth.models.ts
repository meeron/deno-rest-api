export type OAuth2GrantType = "client_credentials";
export type OAuth2TokenType = "Bearer";
export type OAuth2ErrorType = "invalid_request" | "invalid_client" | "invalid_grant" | "unauthorized_client" | "unsupported_grant_type";

export interface CreateTokenRequest {
  grant_type: OAuth2GrantType,
  client_id: string,
  client_secret: string,
}

export interface CreateTokenResult {
  error?: { error: OAuth2ErrorType },
  token?: Token,
}

export interface Token {
  access_token: string,
  token_type: OAuth2TokenType,
  expires_in: number,
}
