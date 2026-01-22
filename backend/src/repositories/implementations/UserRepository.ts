import { injectable } from 'inversify';
import { User, IUser } from '../../models/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { RegisterDto, KycUpdateDto, PaginatedUsers } from '../../dto/user.dto';

interface UserQuery {
  $or?: Array<
    | { email: { $regex: string; $options: string } }
    | { username: { $regex: string; $options: string } }
  >;
}

@injectable()
export class UserRepository implements IUserRepository {
    async create(userData: RegisterDto): Promise<IUser> {
        const user = new User(userData);
        return user.save()
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({email: email.toLowerCase()}).select('+password');
    }

    async findByUsername(username: string): Promise<IUser | null> {
        return User.findOne({username: username.trim().toLowerCase()}).select('+password');
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    async updateKYC(userId: string, kycData: KycUpdateDto): Promise<IUser | null> {
        return User.findByIdAndUpdate(userId, {$set: kycData}, {new: true});
    }
    async findWithPagination(page: number, limit: number, search?: string): Promise<PaginatedUsers<IUser>> {
        const skip = (page -1) * limit;
        const query: UserQuery = {};
        if(search){
            const regex = {$regex: search, $options:'i'};
            query.$or = [{email: regex}, {username: regex}];
        }
        const [users, totalUsers] = await Promise.all([
            User.find(query).select('-password').skip(skip).limit(limit).sort({createdAt:-1}),
            User.countDocuments(query),
        ]);
        const totalPages = Math.ceil(totalUsers/limit);
        return{users, totalPages, currentPage: page, totalUsers,}
    }
}