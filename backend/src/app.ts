import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import walletRoutes from './routes/wallet.routes';
import rouletteRoutes from './routes/roulette.routes';

const FRONTEND_DIST_PATH = path.join(__dirname, '..', '..', 'frontend', 'dist');

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

app.use(express.static(FRONTEND_DIST_PATH));

app.get('*', (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIST_PATH, 'index.html'));
});

export default app;
