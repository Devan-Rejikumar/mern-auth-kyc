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
let UserController = class UserController {
    constructor(_userService) {
        this._userService = _userService;
        this.register = async (req, res) => {
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
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Registration failed';
                res.status(400).json({ message });
            }
        };
        this.login = async (req, res) => {
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
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Invalid credentials';
                res.status(401).json({ message });
            }
        };
        this.getMe = async (req, res) => {
            try {
                console.log('req.user', req.user);
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
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Server error';
                res.status(500).json({ message });
            }
        };
        this.logout = async (_req, res) => {
            try {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });
                res.json({ message: 'Logged out successfully' });
            }
            catch (error) {
                console.error('Logout error:', error);
                res.status(500).json({ message: 'Server error' });
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
