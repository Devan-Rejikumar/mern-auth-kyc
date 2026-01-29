import { PaginatedResult } from '../../types/pagination';

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
}

export interface PaginationOptions {
  select?: string;
}