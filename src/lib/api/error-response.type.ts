export interface ErrorResponseType<T> {
  index: number;
  data: T;
  error: string;
}
