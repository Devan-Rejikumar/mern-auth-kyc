import { RegisterDto, LoginDto } from '../../dto/user.dto';
import { IUser } from '../../models/User';

export interface IUserService {
  register(payload: RegisterDto): Promise<IUser>;
  login(payload: LoginDto): Promise<{ user: IUser; token: string }>;
  getMe(userId: string): Promise<IUser>;
}