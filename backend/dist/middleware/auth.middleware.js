"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const container_1 = require("../container");
const tokens_1 = require("../types/tokens");
const jwtService = container_1.container.get(tokens_1.TYPES.JwtService);
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.substring(7);
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.substring(7);
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const decoded = jwtService.verifyToken(token);
        if (decoded.role !== 'admin') {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.adminMiddleware = adminMiddleware;
