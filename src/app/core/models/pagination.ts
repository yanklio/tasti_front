type PaginationLink = {
  next: string | null;
  previous: string | null;
};

export class PaginatedResponse<T> {
  total: number;
  total_pages: number;
  page_size: number;
  links: PaginationLink;
  results: T[];

  constructor(data: PaginatedResponse<T>) {
    this.total = data.total;
    this.total_pages = data.total_pages;
    this.page_size = data.page_size;
    this.links = data.links;
    this.results = data.results;
  }
}

export type PaginationState = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  nextLink: string | null;
  hasPrevious: boolean;
  previousLink: string | null;
};
