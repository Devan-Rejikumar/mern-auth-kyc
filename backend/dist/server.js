"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const env_config_1 = require("./config/env.config");
const routes_constant_1 = require("./constants/routes.constant");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const kyc_routes_1 = __importDefault(require("./routes/kyc.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_config_1.envConfig.frontendUrl,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log('req.cookies', req.cookies);
    next();
});
console.log('Server starting...');
app.get(routes_constant_1.API_ROUTES.API_HEALTH, (req, res, next) => {
    res.json({ message: 'Healthy' });
});
app.use(routes_constant_1.API_ROUTES.AUTH.BASE, user_routes_1.default);
app.use(routes_constant_1.API_ROUTES.KYC.BASE, kyc_routes_1.default);
app.use(routes_constant_1.API_ROUTES.ADMIN.BASE, admin_routes_1.default);
app.get(routes_constant_1.API_ROUTES.HEALTH, (req, res) => {
    res.json({ message: 'Server is running' });
});
const startServer = async () => {
    try {
        app.listen(Number(env_config_1.envConfig.port), '0.0.0.0', () => {
            console.log(`Server is running on port ${env_config_1.envConfig.port}`);
        });
        await (0, db_1.connectDB)();
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
