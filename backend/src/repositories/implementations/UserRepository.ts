import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';
import { User, IUser } from '../../models/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { RegisterDto, KycUpdateDto, PaginatedUsers } from '../../dto/user.dto';
import { BaseRepository } from './BaseRepository';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User);
    }

    async create(userData: RegisterDto): Promise<IUser> {
        const user = new User(userData);
        return user.save();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email: email.toLowerCase() }).select('+password');
    }

    async findByUsername(username: string): Promise<IUser | null> {
        return User.findOne({ username: username.trim().toLowerCase() }).select('+password');
    }

    async findById(id: string): Promise<IUser | null> {
        return super.findById(id);
    }

    async updateKYC(userId: string, kycData: KycUpdateDto): Promise<IUser | null> {
        return User.findByIdAndUpdate(userId, { $set: kycData }, { new: true });
    }

    async findWithPagination(page: number, limit: number, search?: string): Promise<PaginatedUsers<IUser>> {
        const query: FilterQuery<IUser> = {};
        if (search) {
            const regex = { $regex: search, $options: 'i' };
            query.$or = [{ email: regex }, { username: regex }];
        }
        return this.executeFindWithPagination(page, limit, query, { select: '-password' });
    }
}