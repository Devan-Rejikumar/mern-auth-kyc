import { injectable } from 'inversify';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IJwtService } from '../interfaces/IJwtService';
import { JwtPayload } from '../../types/auth.types';

@injectable()
export class JwtService implements IJwtService {
  private _getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return secret;
  }

  generateToken(payload: JwtPayload, options: SignOptions = { expiresIn: '24h' }): string {
    return jwt.sign(payload, this._getSecret(), options);
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this._getSecret()) as JwtPayload;
  }
}