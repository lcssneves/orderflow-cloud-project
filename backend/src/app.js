import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix para erro querySrv ECONNREFUSED em alguns provedores de internet
dns.setServers(['8.8.8.8', '1.1.1.1']);

import authRoutes    from './routes/authRoutes.js';
import orderRoutes   from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { setupSwagger } from './config/swagger.js';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Logs em arquivo ──────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir   = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const accessLog = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: accessLog })); // log em arquivo
app.use(morgan('dev'));                              // log no console

// ── Documentação (Swagger) ──────────────────────────────────
setupSwagger(app);

// ── Rotas ───────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'API OrderFlow funcionando 🚀' });
});

app.use('/auth',     authRoutes);
app.use('/orders',   orderRoutes);
app.use('/products', productRoutes);

// ── 404 Handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ── Error Handler ────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Erro interno do servidor' });
});



// ── Seed Admin ───────────────────────────────────────────────
async function seedAdmin() {
  const existing = await User.findOne({ email: 'admin@orderflow.com' });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Administrador', email: 'admin@orderflow.com', password: hashed, role: 'admin' });
    console.log('👤 Admin criado: admin@orderflow.com / admin123');
  }
}

// ── Banco de dados + Servidor ─────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      console.log('✅ MongoDB conectado');
      await seedAdmin();
      app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Erro ao conectar ao MongoDB:', err.message);
      process.exit(1);
    });
}

export default app;
