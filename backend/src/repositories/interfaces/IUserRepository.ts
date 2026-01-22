import { IUser } from "../../models/User";
import { RegisterDto, KycUpdateDto, PaginatedUsers } from "../../dto/user.dto";

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    create(userData: RegisterDto): Promise<IUser>;
    updateKYC(userId: string, kycData: KycUpdateDto): Promise<IUser | null>;
    findWithPagination(page: number, limit: number, search?: string): Promise< PaginatedUsers<IUser>>;
}