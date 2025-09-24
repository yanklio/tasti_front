export class PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];

  constructor(data: PaginatedResponse<T>) {
    this.count = data.count;
    this.next = data.next;
    this.previous = data.previous;
    this.results = data.results;
  }
}
