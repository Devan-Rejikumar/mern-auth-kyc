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
exports.KycController = void 0;
const inversify_1 = require("inversify");
const tokens_1 = require("../types/tokens");
const http_status_enum_1 = require("../constants/http-status.enum");
const messages_constant_1 = require("../constants/messages.constant");
let KycController = class KycController {
    constructor(_kycService) {
        this._kycService = _kycService;
        this.uploadKycFile = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(http_status_enum_1.HttpStatus.BAD_REQUEST).json({ message: messages_constant_1.KYC_MESSAGES.NO_FILE });
                    return;
                }
                if (!req.user) {
                    res.status(http_status_enum_1.HttpStatus.UNAUTHORIZED).json({ message: messages_constant_1.AUTH_MESSAGES.UNAUTHORIZED });
                    return;
                }
                const fileUrl = await this._kycService.uploadFileToCloudinary(req.file, req.user.userId);
                res.status(http_status_enum_1.HttpStatus.OK).json({
                    message: messages_constant_1.KYC_MESSAGES.UPLOAD_SUCCESS,
                    filePath: fileUrl,
                    type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : messages_constant_1.KYC_MESSAGES.UPLOAD_ERROR;
                console.error('File upload error:', error);
                res.status(http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
            }
        };
    }
};
exports.KycController = KycController;
exports.KycController = KycController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(tokens_1.TYPES.KycService)),
    __metadata("design:paramtypes", [Object])
], KycController);
