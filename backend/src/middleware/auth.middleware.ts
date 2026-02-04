import { Request, Response, NextFunction } from 'express';
import { container } from '../container';
import { TYPES } from '../types/tokens';
import { IJwtService } from '../services/interfaces/IJwtService';
import { JwtPayload } from '../types/auth.types';
import { HttpStatus } from '../constants/http-status.enum';
import { AUTH_MESSAGES } from '../constants/messages.constant';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const jwtService = container.get<IJwtService>(TYPES.JwtService);

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    console.log('req.cookies', req.cookies);
    const token = req.cookies?.token || req.headers.authorization?.substring(7);
    console.log('token', token);
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.NO_TOKEN });
      return;
    }
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.INVALID_TOKEN });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.substring(7);
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.NO_TOKEN });
      return;
    }
    const decoded = jwtService.verifyToken(token);
    if (decoded.role !== 'admin') {
      res.status(HttpStatus.FORBIDDEN).json({ message: AUTH_MESSAGES.ADMIN_ACCESS_REQUIRED });
      return;
    }
    req.user = decoded;
    next();
  } catch {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.INVALID_TOKEN });
  }
};