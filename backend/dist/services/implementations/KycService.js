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
exports.KycService = void 0;
const inversify_1 = require("inversify");
const tokens_1 = require("../../types/tokens");
let KycService = class KycService {
    constructor(_userRepository, _cloudinaryService) {
        this._userRepository = _userRepository;
        this._cloudinaryService = _cloudinaryService;
    }
    async uploadFileToCloudinary(file, userId) {
        const isImage = file.mimetype.startsWith('image/');
        const folder = isImage ? 'kyc-images' : 'kyc-videos';
        const resourceType = isImage ? 'image' : 'video';
        const fileUrl = await this._cloudinaryService.upload(file, folder, resourceType);
        if (userId) {
            await this._userRepository.updateKYC(userId, isImage ? { kycImage: fileUrl } : { kycVideo: fileUrl });
        }
        return fileUrl;
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tokens_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(tokens_1.TYPES.CloudinaryService)),
    __metadata("design:paramtypes", [Object, Object])
], KycService);
