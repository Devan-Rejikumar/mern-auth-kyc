import { inject, injectable } from 'inversify';
import { TYPES } from '../../types/tokens';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IJwtService } from '../interfaces/IJwtService';
import { RegisterDto, LoginDto } from '../../dto/dtos/user.dto';
import { IUser } from '../../models/User';
import { IUserService } from '../interfaces/IUserService';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
        @inject(TYPES.JwtService) private _jwtService: IJwtService
    ) {}

    async register(payload: RegisterDto): Promise<IUser> {
        const emailExists = await this._userRepo.findByEmail(payload.email);
        if(emailExists) throw new Error('Email already exists');
        const usernameExists = await this._userRepo.findByUsername(payload.username);
        if(usernameExists) throw new Error('Username already exists please choose another one');
        return this._userRepo.create(payload);
    }

    async login(payload: LoginDto): Promise<{ user: IUser; token: string; }> {
        const user = await this._userRepo.findByEmail(payload.email);
        if(!user || !(await user.comparePassword(payload.password))){
            throw new Error('Invalid credentials');
        }
        const token = this._jwtService.generateToken({userId: user._id.toString(),email: user.email, role: user.role});
        return { user, token};
    }

    async getMe(userId: string): Promise<IUser> {
        const user = await this._userRepo.findById(userId);
        if(!user) throw new Error('User not found');
        return user;
    }
}