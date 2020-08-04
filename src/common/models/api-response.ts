export interface ApiHttpError {
  statusCode: number;

  message: string;
}

export interface ApiHttpResponse<T = Record<string, unknown>> {
  success: boolean;

  data: T;

  error: ApiHttpError | Record<string, unknown>;
}
