export type AsyncControllerAction = (params: Record<string, any>) => Promise<void>;
export type ControllerAction = (params: Record<string, any>) => void;
export type HttpMethod = "get" | "post" | "delete";

export interface MapOptions {
  method: HttpMethod,
  path: string,
  useAuth: boolean,
}

export * from "./route_config.ts";
