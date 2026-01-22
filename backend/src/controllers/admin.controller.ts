import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { TYPES } from '../types/tokens';
import { IAdminService } from '../services/interfaces/IAdminService';
import { AuthRequest } from '../middleware/auth.middleware';

@injectable()
export class AdminController {
  constructor(@inject(TYPES.AdminService) private _adminService: IAdminService) {}

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

