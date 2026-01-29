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
exports.AdminService = void 0;
const inversify_1 = require("inversify");
const tokens_1 = require("../../types/tokens");
let AdminService = class AdminService {
    constructor(_adminRepo) {
        this._adminRepo = _adminRepo;
    }
    async getAllUsers(page, limit, search) {
        const result = await this._adminRepo.findAllUsers(page, limit, search);
        const users = result.users.map(user => ({
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            phone: user.phone,
            role: user.role,
            kycImage: user.kycImage,
            kycVideo: user.kycVideo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
        return {
            users,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            totalUsers: result.totalUsers,
        };
    }
    async getUserById(userId) {
        const user = await this._adminRepo.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            phone: user.phone,
            role: user.role,
            kycImage: user.kycImage,
            kycVideo: user.kycVideo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tokens_1.TYPES.AdminRepository)),
    __metadata("design:paramtypes", [Object])
], AdminService);
