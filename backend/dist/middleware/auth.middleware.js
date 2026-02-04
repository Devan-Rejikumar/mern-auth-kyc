"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const container_1 = require("../container");
const tokens_1 = require("../types/tokens");
const http_status_enum_1 = require("../constants/http-status.enum");
const messages_constant_1 = require("../constants/messages.constant");
const jwtService = container_1.container.get(tokens_1.TYPES.JwtService);
const authMiddleware = (req, res, next) => {
    try {
        console.log('req.cookies', req.cookies);
        const token = req.cookies?.token || req.headers.authorization?.substring(7);
        console.log('token', token);
        if (!token) {
            res.status(http_status_enum_1.HttpStatus.UNAUTHORIZED).json({ message: messages_constant_1.AUTH_MESSAGES.NO_TOKEN });
            return;
        }
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        next();
    }
    catch {
        res.status(http_status_enum_1.HttpStatus.UNAUTHORIZED).json({ message: messages_constant_1.AUTH_MESSAGES.INVALID_TOKEN });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.substring(7);
        if (!token) {
            res.status(http_status_enum_1.HttpStatus.UNAUTHORIZED).json({ message: messages_constant_1.AUTH_MESSAGES.NO_TOKEN });
            return;
        }
        const decoded = jwtService.verifyToken(token);
        if (decoded.role !== 'admin') {
            res.status(http_status_enum_1.HttpStatus.FORBIDDEN).json({ message: messages_constant_1.AUTH_MESSAGES.ADMIN_ACCESS_REQUIRED });
            return;
        }
        req.user = decoded;
        next();
    }
    catch {
        res.status(http_status_enum_1.HttpStatus.UNAUTHORIZED).json({ message: messages_constant_1.AUTH_MESSAGES.INVALID_TOKEN });
    }
};
exports.adminMiddleware = adminMiddleware;
