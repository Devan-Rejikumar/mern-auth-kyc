import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../types/tokens';
import { IUserService } from '../services/interfaces/IUserService';
import { AuthRequest } from '../middleware/auth.middleware';
import { HttpStatus } from '../constants/http-status.enum';
import { AUTH_MESSAGES, ERROR_MESSAGES } from '../constants/messages.constant';
import { envConfig } from '../config/env.config';
import { AppError } from '../errors/app-error';
import { toUserAuthResponse, toUserProfileResponse } from '../dto/mappers/user.mapper';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this._userService.register(req.body);
      res.status(HttpStatus.CREATED).json({
        message: AUTH_MESSAGES.REGISTER_SUCCESS,
        user: toUserAuthResponse(user),
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.REGISTRATION_FAILED;
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, token } = await this._userService.login(req.body);
      res.cookie('token', token, {
        httpOnly: true,
        secure: envConfig.isProduction,
        sameSite: envConfig.isBehindProxy ? 'lax' : 'none',
        maxAge: envConfig.cookieMaxAge,
      });
      res.status(HttpStatus.OK).json({
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        user: toUserAuthResponse(user),
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      const message = error instanceof Error ? error.message : AUTH_MESSAGES.INVALID_CREDENTIALS;
      res.status(HttpStatus.UNAUTHORIZED).json({ message });
    }
  };

  getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      console.log('req.user', req.user);
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.UNAUTHORIZED });
        return;
      }

      const user = await this._userService.getMe(req.user.userId);
      res.status(HttpStatus.OK).json(toUserProfileResponse(user));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  logout = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: envConfig.isProduction,
        sameSite: envConfig.isBehindProxy ? 'lax' : 'none',
      });
      res.status(HttpStatus.OK).json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}