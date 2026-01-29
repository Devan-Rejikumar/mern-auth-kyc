import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';
import { User, IUser } from '../../models/User';
import { IAdminRepository } from '../interfaces/IAdminRepository';
import { PaginatedResult } from '../../types/pagination';
import { BaseRepository } from './BaseRepository';

@injectable()
export class AdminRepository extends BaseRepository<IUser> implements IAdminRepository {
    constructor() {
        super(User);
    }

    async findAllUsers(page: number, limit: number, search?: string): Promise<PaginatedResult<IUser>> {
        const filter: FilterQuery<IUser> = { role: 'user' };
        if (search) {
            filter.$and = [
                { role: 'user' },
                {
                    $or: [
                        { email: { $regex: search, $options: 'i' } },
                        { username: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } },
                    ],
                },
            ];
        }
        return this.executeFindWithPagination(page, limit, filter, { select: '-password' });
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return this.model.findById(userId).select('-password').exec();
    }
}