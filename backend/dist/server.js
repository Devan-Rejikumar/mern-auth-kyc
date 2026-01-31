"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const kyc_routes_1 = __importDefault(require("./routes/kyc.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log('req.cookies', req.cookies);
    next();
});
console.log('Serverrrrrrrrrrr');
app.get('/api/health', (req, res, next) => {
    res.json({ message: 'Healthty' });
});
app.use('/api/auth', user_routes_1.default);
app.use('/api/kyc', kyc_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.get('/health', (req, res) => {
    res.json({ message: 'Server is running' });
});
const startServer = async () => {
    try {
        app.listen(Number(PORT), '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
        await (0, db_1.connectDB)();
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
