export interface RegisterDto {
    email: string;
    username: string;
    password: string;
    phone: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface KycUpdateDto {
    kycImage?: string;
    kycVideo?: string;
}

export interface PaginatedUsers<T> {
    users: T[];
    totalPages: number;
    currentPage: number;
    totalUsers: number;
}

export interface UserResponseDto {
    _id: string;
    email: string;
    username: string;
    phone: string;
    role: string;
    kycImage?: string;
    kycVideo?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
