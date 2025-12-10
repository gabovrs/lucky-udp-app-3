import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import walletRoutes from './routes/wallet.routes';
import rouletteRoutes from './routes/roulette.routes';

dotenv.config();
connectDB();

const app = express();

// middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', walletRoutes);
app.use('/api', rouletteRoutes);

export default app;
