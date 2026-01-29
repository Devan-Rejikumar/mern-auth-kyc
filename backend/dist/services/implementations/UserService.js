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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const tokens_1 = require("../../types/tokens");
let UserService = class UserService {
    constructor(_userRepo, _jwtService) {
        this._userRepo = _userRepo;
        this._jwtService = _jwtService;
    }
    async register(payload) {
        const emailExists = await this._userRepo.findByEmail(payload.email);
        if (emailExists)
            throw new Error('Email already exists');
        const usernameExists = await this._userRepo.findByUsername(payload.username);
        if (usernameExists)
            throw new Error('Username already exists please choose another one');
        return this._userRepo.create(payload);
    }
    async login(payload) {
        const user = await this._userRepo.findByEmail(payload.email);
        if (!user || !(await user.comparePassword(payload.password))) {
            throw new Error('Invalid credentials');
        }
        const token = this._jwtService.generateToken({ userId: user._id.toString(), email: user.email, role: user.role });
        return { user, token };
    }
    async getMe(userId) {
        const user = await this._userRepo.findById(userId);
        if (!user)
            throw new Error('User not found');
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tokens_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(tokens_1.TYPES.JwtService)),
    __metadata("design:paramtypes", [Object, Object])
], UserService);
