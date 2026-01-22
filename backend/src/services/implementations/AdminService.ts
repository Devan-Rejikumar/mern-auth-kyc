import { inject, injectable } from 'inversify';
import { TYPES } from '../../types/tokens';
import { IAdminRepository } from '../../repositories/interfaces/IAdminRepository';
import { IAdminService } from '../interfaces/IAdminService';
import { UserResponseDto, PaginatedUsers } from '../../dto/user.dto';

@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(TYPES.AdminRepository) private _adminRepo: IAdminRepository
    ) {}

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

