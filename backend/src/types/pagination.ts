export interface PaginatedResult<T> {
    users: T[];
    totalPages: number;
    currentPage: number;
    totalUsers: number;
  }
  

