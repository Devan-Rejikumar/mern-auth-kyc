import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { envConfig } from './config/env.config';
import { API_ROUTES } from './constants/routes.constant';
import userRoutes from './routes/user.routes';
import kycRoutes from './routes/kyc.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(cors({
  origin: envConfig.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('req.cookies', req.cookies);
  next();
});

console.log('Server starting...');

app.get(API_ROUTES.API_HEALTH, (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Healthy' });
});

app.use(API_ROUTES.AUTH.BASE, userRoutes);
app.use(API_ROUTES.KYC.BASE, kycRoutes);
app.use(API_ROUTES.ADMIN.BASE, adminRoutes);

app.get(API_ROUTES.HEALTH, (req, res) => {
  res.json({ message: 'Server is running' });
});

const startServer = async () => {
  try {
    app.listen(Number(envConfig.port), '0.0.0.0', () => {
      console.log(`Server is running on port ${envConfig.port}`);
    });
    await connectDB();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();