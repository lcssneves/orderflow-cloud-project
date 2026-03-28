import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// ── Gerar token JWT ──────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /auth/register ──────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /auth/login ─────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /auth/me ─────────────────────────────────────────────
import authMiddleware from '../middleware/authMiddleware.js';

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
