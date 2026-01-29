import { Request, Response, NextFunction } from 'express';
import { container } from '../container';
import { TYPES } from '../types/tokens';
import { IJwtService } from '../services/interfaces/IJwtService';
import { JwtPayload } from '../types/auth.types';

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
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.substring(7);
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    const decoded = jwtService.verifyToken(token);
    if (decoded.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};