import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../types/tokens';
import { IAdminService } from '../services/interfaces/IAdminService';
import { AuthRequest } from '../middleware/auth.middleware';

@injectable()
export class AdminController {
  constructor(@inject(TYPES.AdminService) private _adminService: IAdminService) {}

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, token } = await this._adminService.adminLogin(req.body);
      const isBehindProxy = process.env.BEHIND_PROXY === 'true';
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: isBehindProxy ? 'lax' : 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({
        message: 'Admin login successful',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      res.status(403).json({ message });
    }
  };

  getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await this._adminService.getAllUsers(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error fetching users' });
    }
  };

  getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await this._adminService.getUserById(userId);
      res.json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'User not found';
      res.status(404).json({ message });
    }
  };
}
