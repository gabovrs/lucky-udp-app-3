import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { username, password, password2 } = req.body;

    if (!username || !password || !password2) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (password !== password2) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ // revisar
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser._id,
        username: newUser.username,
        balance: newUser.balance,
        createdAt: newUser.createdAt,
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está definida en .env');
    }

    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      secret,
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        balance: user.balance,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;