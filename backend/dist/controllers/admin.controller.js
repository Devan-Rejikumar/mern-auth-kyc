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
let AdminController = class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
        this.getAllUsers = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search;
                const result = await this._adminService.getAllUsers(page, limit, search);
                res.json(result);
            }
            catch (error) {
                console.error('Get users error:', error);
                res.status(500).json({ message: 'Server error fetching users' });
            }
        };
        this.getUserById = async (req, res) => {
            try {
                const { userId } = req.params;
                const user = await this._adminService.getUserById(userId);
                res.json(user);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'User not found';
                res.status(404).json({ message });
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
