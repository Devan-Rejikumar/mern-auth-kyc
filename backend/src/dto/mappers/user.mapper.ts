import { IUser } from '../../models/User';
import { UserResponseDto, UserAuthResponseDto, UserProfileResponseDto } from '../dtos/user.dto';

/**
 * Maps IUser to slim auth response (login/register)
 */
export const toUserAuthResponse = (user: IUser): UserAuthResponseDto => ({
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
});

/**
 * Maps IUser to full profile response (getMe endpoint)
 */
export const toUserProfileResponse = (user: IUser): UserProfileResponseDto => ({
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
    phone: user.phone,
    kycImage: user.kycImage,
    kycVideo: user.kycVideo,
});

/**
 * Maps IUser to UserResponseDto (admin operations)
 */
export const toUserResponseDto = (user: IUser): UserResponseDto => ({
    _id: user._id.toString(),
    email: user.email,
    username: user.username,
    phone: user.phone,
    role: user.role,
    kycImage: user.kycImage,
    kycVideo: user.kycVideo,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

/**
 * Maps array of IUser to UserResponseDto array
 */
export const toUserListResponse = (users: IUser[]): UserResponseDto[] => 
    users.map(toUserResponseDto);
