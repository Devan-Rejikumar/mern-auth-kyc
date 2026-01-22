import { IUser } from '../../models/User';

export interface PaginatedResult<T> {
    users: T[];
    totalPages: number;
    currentPage: number;
    totalUsers: number;
}

export interface IAdminRepository {
    findAllUsers(page: number, limit: number, search?: string): Promise<PaginatedResult<IUser>>;
    findUserById(userId: string): Promise<IUser | null>;
}

