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

/** Estado de paginación que usan las pantallas de catálogo. `number` es base 0, igual que el API. */
export interface PageInfo extends PageResource {
  totalElements: number;
}
