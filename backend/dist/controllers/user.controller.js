"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const inversify_1 = require("inversify");
const tokens_1 = require("../types/tokens");
const http_status_enum_1 = require("../constants/http-status.enum");
const messages_constant_1 = require("../constants/messages.constant");
const env_config_1 = require("../config/env.config");
const app_error_1 = require("../errors/app-error");
let UserController = class UserController {
    constructor(_userService) {
        this._userService = _userService;
        this.register = async (req, res) => {
            try {
                const user = await this._userService.register(req.body);
                res.status(http_status_enum_1.HttpStatus.CREATED).json({
                    message: messages_constant_1.AUTH_MESSAGES.REGISTER_SUCCESS,
                    user: {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                    },
                });
            }
            catch (error) {
                if (error instanceof app_error_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                const message = error instanceof Error ? error.message : messages_constant_1.ERROR_MESSAGES.REGISTRATION_FAILED;
                res.status(http_status_enum_1.HttpStatus.BAD_REQUEST).json({ message });
            }
        };
        this.login = async (req, res) => {
            try {
                const { user, token } = await this._userService.login(req.body);
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: env_config_1.envConfig.isProduction,
                    sameSite: env_config_1.envConfig.isBehindProxy ? 'lax' : 'none',
                    maxAge: env_config_1.envConfig.cookieMaxAge,
                });
                res.status(http_status_enum_1.HttpStatus.OK).json({
                    message: messages_constant_1.AUTH_MESSAGES.LOGIN_SUCCESS,
                    user: {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                    },
                });
            }
            catch (error) {
                if (error instanceof app_error_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                const message = error instanceof Error ? error.message : messages_constant_1.AUTH_MESSAGES.INVALID_CREDENTIALS;
                res.status(http_status_enum_1.HttpStatus.UNAUTHORIZED).json({ message });
            }
        };
        this.getMe = async (req, res) => {
            try {
                console.log('req.user', req.user);
                if (!req.user) {
                    res.status(http_status_enum_1.HttpStatus.UNAUTHORIZED).json({ message: messages_constant_1.AUTH_MESSAGES.UNAUTHORIZED });
                    return;
                }
                const user = await this._userService.getMe(req.user.userId);
                res.status(http_status_enum_1.HttpStatus.OK).json({
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    phone: user.phone,
                    kycImage: user.kycImage,
                    kycVideo: user.kycVideo,
                });
            }
            catch (error) {
                if (error instanceof app_error_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                const message = error instanceof Error ? error.message : messages_constant_1.ERROR_MESSAGES.SERVER_ERROR;
                res.status(http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
            }
        };
        this.logout = async (_req, res) => {
            try {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: env_config_1.envConfig.isProduction,
                    sameSite: env_config_1.envConfig.isBehindProxy ? 'lax' : 'none',
                });
                res.status(http_status_enum_1.HttpStatus.OK).json({ message: messages_constant_1.AUTH_MESSAGES.LOGOUT_SUCCESS });
            }
            catch (error) {
                console.error('Logout error:', error);
                res.status(http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: messages_constant_1.ERROR_MESSAGES.SERVER_ERROR });
            }
        };
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tokens_1.TYPES.UserService)),
    __metadata("design:paramtypes", [Object])
], UserController);
