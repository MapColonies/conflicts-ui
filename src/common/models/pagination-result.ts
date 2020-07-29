export interface PaginationResult<T> {
  currentPage: number;

  perPage: number;

  offset: number;

  total: number;

  lastPage?: number;

  data: T;

  from?: number;

  to?: number;
}
