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
let KycController = class KycController {
    constructor(_kycService) {
        this._kycService = _kycService;
        this.uploadKycFile = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).json({ message: 'No file provided' });
                    return;
                }
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const fileUrl = await this._kycService.uploadFileToCloudinary(req.file, req.user.userId);
                res.json({
                    message: 'File uploaded successfully',
                    filePath: fileUrl,
                    type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Server error uploading file';
                console.error('File upload error:', error);
                res.status(500).json({ message });
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
