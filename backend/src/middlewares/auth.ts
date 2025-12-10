import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function authRequired(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = header.split(' ')[1];

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET no está definida en .env');
    }

    const payload = jwt.verify(token, secret) as { sub: string, username: string };

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}