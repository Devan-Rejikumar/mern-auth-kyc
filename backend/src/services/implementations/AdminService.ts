import { inject, injectable } from 'inversify';
import { TYPES } from '../../types/tokens';
import { IAdminRepository } from '../../repositories/interfaces/IAdminRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IJwtService } from '../interfaces/IJwtService';
import { IAdminService } from '../interfaces/IAdminService';
import { UserResponseDto, PaginatedUsers, LoginDto } from '../../dto/user.dto';
import { IUser } from '../../models/User';

@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(TYPES.AdminRepository) private _adminRepo: IAdminRepository,
        @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
        @inject(TYPES.JwtService) private _jwtService: IJwtService
    ) {}

    async adminLogin(payload: LoginDto): Promise<{ user: IUser; token: string }> {
        const user = await this._userRepo.findByEmail(payload.email);
        if (!user || !(await user.comparePassword(payload.password))) {
            throw new Error('Invalid credentials');
        }
        if (user.role !== 'admin') {
            throw new Error('Access denied. Admin privileges required.');
        }
        const token = this._jwtService.generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });
        return { user, token };
    }

    async getAllUsers(page: number, limit: number, search?: string): Promise<PaginatedUsers<UserResponseDto>> {
        const result = await this._adminRepo.findAllUsers(page, limit, search);
        
        const users: UserResponseDto[] = result.users.map(user => ({
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            phone: user.phone,
            role: user.role,
            kycImage: user.kycImage,
            kycVideo: user.kycVideo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        return {
            users,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            totalUsers: result.totalUsers,
        };
    }

    async getUserById(userId: string): Promise<UserResponseDto> {
        const user = await this._adminRepo.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            phone: user.phone,
            role: user.role,
            kycImage: user.kycImage,
            kycVideo: user.kycVideo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
