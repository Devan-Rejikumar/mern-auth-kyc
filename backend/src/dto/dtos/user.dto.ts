import { PaginatedResult } from '../../types/pagination';

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

export type PaginatedUsers<T> = PaginatedResult<T>;

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

// Slim response for login/register (excludes sensitive/optional fields)
export interface UserAuthResponseDto {
    id: string;
    email: string;
    username: string;
    role: string;
}

// Full profile response including KYC fields
export interface UserProfileResponseDto {
    id: string;
    email: string;
    username: string;
    role: string;
    phone: string;
    kycImage?: string;
    kycVideo?: string;
}
