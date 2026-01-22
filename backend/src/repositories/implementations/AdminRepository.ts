import { injectable } from 'inversify';
import { User, IUser } from '../../models/User';
import { IAdminRepository, PaginatedResult } from '../interfaces/IAdminRepository';
import { FilterQuery } from 'mongoose';

@injectable()
export class AdminRepository implements IAdminRepository {
    async findAllUsers(page: number, limit: number, search?: string): Promise<PaginatedResult<IUser>> {
        const skip = (page - 1) * limit;
        
        const query: FilterQuery<IUser> = {
            role: 'user'
        };
        
        if (search) {
            query.$and = [
                { role: 'user' },
                {
                    $or: [
                        { email: { $regex: search, $options: 'i' } },
                        { username: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } },
                    ]
                }
            ];
        }

        const [users, totalUsers] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            User.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalUsers / limit);

        return {
            users,
            totalPages,
            currentPage: page,
            totalUsers,
        };
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return User.findById(userId).select('-password').exec();
    }
}