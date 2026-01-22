import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../types/tokens';
import { IUserService } from '../services/interfaces/IUserService';
import { AuthRequest } from '../middleware/auth.middleware';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this._userService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({ message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, token } = await this._userService.login(req.body);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      res.status(401).json({ message });
    }
  };

  getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await this._userService.getMe(req.user.userId);
      res.json({
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        phone: user.phone,
        kycImage: user.kycImage,
        kycVideo: user.kycVideo,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      res.status(500).json({ message });
    }
  };

  logout = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
}