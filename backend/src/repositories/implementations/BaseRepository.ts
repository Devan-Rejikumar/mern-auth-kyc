import { FilterQuery, Model } from 'mongoose';
import { PaginatedResult } from '../../types/pagination';
import { PaginationOptions } from '../interfaces/IBaseRepository';

export abstract class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: string, options?: PaginationOptions): Promise<T | null> {
    let query = this.model.findById(id);
    if (options?.select) {
      query = query.select(options.select);
    }
    return query.exec();
  }

  async findOne(filter: FilterQuery<T>, options?: PaginationOptions): Promise<T | null> {
    let query = this.model.findOne(filter);
    if (options?.select) {
      query = query.select(options.select);
    }
    return query.exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save() as Promise<T>;
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
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