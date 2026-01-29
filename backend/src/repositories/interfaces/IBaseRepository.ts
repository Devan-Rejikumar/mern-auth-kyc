import { FilterQuery } from 'mongoose';
import { PaginatedResult } from '../../types/pagination';

export interface PaginationOptions {
  select?: string;
}

export interface IBaseRepository<T> {
  findById(id: string, options?: PaginationOptions): Promise<T | null>;
  findOne(filter: FilterQuery<T>, options?: PaginationOptions): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  updateById(id: string, data: Partial<T>): Promise<T | null>;
}