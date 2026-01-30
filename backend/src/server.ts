import express, {Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import userRoutes from './routes/user.routes';
import kycRoutes from './routes/kyc.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('req.cookies', req.cookies);
  next();
});


console.log('Serverrrrrrrrrrr')
app.get('/api/health',(req : Request, res : Response, next : NextFunction) => {
  res.json({ message : 'Healthty'  })
})
app.use('/api/auth', userRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const startServer = async () => {
  try {
    app.listen(Number(PORT),'0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
    await connectDB();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();