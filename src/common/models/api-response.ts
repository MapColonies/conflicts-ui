export interface ApiHttpError {
  statusCode: number;

  message: string;
}

export interface ApiHttpResponse<T = {}> {
  success: boolean;

  data: T;

  error: ApiHttpError | {};
}
