export interface Paged<T> {
  page: number;
  pageCount: number;
  items: T[];
}
