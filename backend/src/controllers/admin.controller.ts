import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../types/tokens';
import { IAdminService } from '../services/interfaces/IAdminService';
import { AuthRequest } from '../middleware/auth.middleware';
import { HttpStatus } from '../constants/http-status.enum';
import { AUTH_MESSAGES, USER_MESSAGES, ERROR_MESSAGES } from '../constants/messages.constant';
import { envConfig } from '../config/env.config';
import { AppError } from '../errors/app-error';

@injectable()
export class AdminController {
  constructor(@inject(TYPES.AdminService) private _adminService: IAdminService) {}

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, token } = await this._adminService.adminLogin(req.body);
      res.cookie('token', token, {
        httpOnly: true,
        secure: envConfig.isProduction,
        sameSite: envConfig.isBehindProxy ? 'lax' : 'none',
        maxAge: envConfig.cookieMaxAge,
      });
      res.status(HttpStatus.OK).json({
        message: AUTH_MESSAGES.ADMIN_LOGIN_SUCCESS,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      const message = error instanceof Error ? error.message : AUTH_MESSAGES.INVALID_CREDENTIALS;
      res.status(HttpStatus.FORBIDDEN).json({ message });
    }
  };

  getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await this._adminService.getAllUsers(page, limit, search);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: USER_MESSAGES.FETCH_ERROR });
    }
  };

  getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await this._adminService.getUserById(userId);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      const message = error instanceof Error ? error.message : USER_MESSAGES.NOT_FOUND;
      res.status(HttpStatus.NOT_FOUND).json({ message });
    }
  };
}

