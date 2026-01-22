import { JwtPayload } from '../../types/auth.types';

export interface IJwtService {
  generateToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload;
}