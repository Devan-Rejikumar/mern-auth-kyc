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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const User_1 = require("../../models/User");
const BaseRepository_1 = require("./BaseRepository");
let UserRepository = class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.User);
    }
    async create(userData) {
        const user = new User_1.User(userData);
        return user.save();
    }
    async findByEmail(email) {
        return User_1.User.findOne({ email: email.toLowerCase() }).select('+password');
    }
    async findByUsername(username) {
        return User_1.User.findOne({ username: username.trim().toLowerCase() }).select('+password');
    }
    async findById(id) {
        return super.findById(id);
    }
    async updateKYC(userId, kycData) {
        return User_1.User.findByIdAndUpdate(userId, { $set: kycData }, { new: true });
    }
    async findWithPagination(page, limit, search) {
        const query = {};
        if (search) {
            const regex = { $regex: search, $options: 'i' };
            query.$or = [{ email: regex }, { username: regex }];
        }
        return this.executeFindWithPagination(page, limit, query, { select: '-password' });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserRepository);
