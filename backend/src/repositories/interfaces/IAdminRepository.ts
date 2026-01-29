import { IUser } from '../../models/User';
import { PaginatedResult } from '../../types/pagination';

export interface IAdminRepository {
    findAllUsers(page: number, limit: number, search?: string): Promise<PaginatedResult<IUser>>;
    findUserById(userId: string): Promise<IUser | null>;
}

