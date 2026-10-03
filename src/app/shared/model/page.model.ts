export interface Pageable {
  page?: number;
  size?: number;
}

export interface PageResource {
  number: number;
  size: number;
}

export interface PageData<T> {
  content: T[];
  size: number;
}

export interface PagedResources<T> {
  data: PageData<T>;
  page: PageResource;
  totalElements: number;
}
