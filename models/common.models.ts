export class Result<TData = any> {
  constructor(
    private readonly data?: TData,
    private readonly errorCode?: string,
    private readonly errorMessage?: string,
  ) {}

  get isSuccess() {
    return this.data != undefined && this.errorCode === undefined;
  }

  static forbidden<TData = any>(message?: string) {
    return new Result<TData>(undefined, "Forbidden", message ?? "Execute access forbidden");
  }

  static success<TData = any>(data: TData) {
    return new Result<TData>(data);
  }
}