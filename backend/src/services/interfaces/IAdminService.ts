import { UserResponseDto, PaginatedUsers, LoginDto } from '../../dto/dtos/user.dto';
import { IUser } from '../../models/User';

export interface IAdminService {
    getAllUsers(page: number, limit: number, search?: string): Promise<PaginatedUsers<UserResponseDto>>;
    getUserById(userId: string): Promise<UserResponseDto>;
    adminLogin(payload: LoginDto): Promise<{ user: IUser; token: string }>;
}

