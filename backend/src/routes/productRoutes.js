import { Router } from 'express';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: CRUD de produtos
 */

// ── GET /products ─────────────────────────────────────────────
// Público — lista todos os produtos com paginação opcional
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    const query = {};
    if (category) query.category = { $regex: category, $options: 'i' };
    if (search)   query.name    = { $regex: search,   $options: 'i' };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({ products, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// ── GET /products/:id ─────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// ── POST /products ────────────────────────────────────────────
// Apenas admin
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem criar produtos' });
    }

    const { name, description, price, stock, category, imageUrl } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }

    const product = await Product.create({ name, description, price, stock, category, imageUrl });
    res.status(201).json({ message: 'Produto criado com sucesso', product });
  } catch (err) {
    next(err);
  }
});

// ── PUT /products/:id ─────────────────────────────────────────
// Apenas admin
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem editar produtos' });
    }

    const { name, description, price, stock, category, imageUrl } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, category, imageUrl },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto atualizado', product });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /products/:id ──────────────────────────────────────
// Apenas admin
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem excluir produtos' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (err) {
    next(err);
  }
});

export default router;
