import { FilterQuery, Model } from 'mongoose';
import { PaginatedResult } from '../../types/pagination';
import { PaginationOptions } from '../interfaces/IBaseRepository';

export abstract class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  protected async executeFindWithPagination(
    page: number,
    limit: number,
    filter: FilterQuery<T> = {},
    options?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const skip = (page - 1) * limit;
    let query = this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (options?.select) {
      query = query.select(options.select);
    }
    const [users, totalUsers] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalUsers / limit);
    return {
      users,
      totalPages,
      currentPage: page,
      totalUsers,
    };
  }
}