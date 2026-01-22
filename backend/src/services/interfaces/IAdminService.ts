import { UserResponseDto, PaginatedUsers } from '../../dto/user.dto';

export interface IAdminService {
    getAllUsers(page: number, limit: number, search?: string): Promise<PaginatedUsers<UserResponseDto>>;
    getUserById(userId: string): Promise<UserResponseDto>;
}

