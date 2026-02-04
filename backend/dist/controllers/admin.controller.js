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
exports.AdminController = void 0;
const inversify_1 = require("inversify");
const tokens_1 = require("../types/tokens");
const http_status_enum_1 = require("../constants/http-status.enum");
const messages_constant_1 = require("../constants/messages.constant");
const env_config_1 = require("../config/env.config");
const app_error_1 = require("../errors/app-error");
let AdminController = class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
        this.adminLogin = async (req, res) => {
            try {
                const { user, token } = await this._adminService.adminLogin(req.body);
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: env_config_1.envConfig.isProduction,
                    sameSite: env_config_1.envConfig.isBehindProxy ? 'lax' : 'none',
                    maxAge: env_config_1.envConfig.cookieMaxAge,
                });
                res.status(http_status_enum_1.HttpStatus.OK).json({
                    message: messages_constant_1.AUTH_MESSAGES.ADMIN_LOGIN_SUCCESS,
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
                res.status(http_status_enum_1.HttpStatus.FORBIDDEN).json({ message });
            }
        };
        this.getAllUsers = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search;
                const result = await this._adminService.getAllUsers(page, limit, search);
                res.status(http_status_enum_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                console.error('Get users error:', error);
                res.status(http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: messages_constant_1.USER_MESSAGES.FETCH_ERROR });
            }
        };
        this.getUserById = async (req, res) => {
            try {
                const { userId } = req.params;
                const user = await this._adminService.getUserById(userId);
                res.status(http_status_enum_1.HttpStatus.OK).json(user);
            }
            catch (error) {
                if (error instanceof app_error_1.AppError) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                const message = error instanceof Error ? error.message : messages_constant_1.USER_MESSAGES.NOT_FOUND;
                res.status(http_status_enum_1.HttpStatus.NOT_FOUND).json({ message });
            }
        };
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tokens_1.TYPES.AdminService)),
    __metadata("design:paramtypes", [Object])
], AdminController);
