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
exports.AdminRepository = void 0;
const inversify_1 = require("inversify");
const User_1 = require("../../models/User");
const BaseRepository_1 = require("./BaseRepository");
let AdminRepository = class AdminRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.User);
    }
    async findAllUsers(page, limit, search) {
        const filter = { role: 'user' };
        if (search) {
            filter.$and = [
                { role: 'user' },
                {
                    $or: [
                        { email: { $regex: search, $options: 'i' } },
                        { username: { $regex: search, $options: 'i' } },
                        { phone: { $regex: search, $options: 'i' } },
                    ],
                },
            ];
        }
        return this.executeFindWithPagination(page, limit, filter, { select: '-password' });
    }
    async findUserById(userId) {
        return super.findById(userId, { select: '-password' });
    }
};
exports.AdminRepository = AdminRepository;
exports.AdminRepository = AdminRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AdminRepository);
