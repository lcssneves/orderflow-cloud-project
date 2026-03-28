import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Todas as rotas de pedido requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

// ── GET /orders ───────────────────────────────────────────────
// Admin vê todos; usuário vê apenas os seus
router.get('/', async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    if (req.query.status) query.status = req.query.status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price imageUrl')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// ── GET /orders/:id ───────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') query.user = req.user._id;

    const order = await Order.findOne(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price imageUrl');

    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// ── POST /orders ──────────────────────────────────────────────
// Cria um pedido com base nos itens do carrinho
router.post('/', async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'O pedido deve conter ao menos um item' });
    }

    // Buscar preço atual de cada produto e montar os itens
    const orderItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findById(productId);
        if (!product) throw new Error(`Produto ${productId} não encontrado`);
        if (product.stock < quantity) throw new Error(`Estoque insuficiente para "${product.name}"`);
        return { product: product._id, quantity, unitPrice: product.price };
      })
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'credit_card',
    });

    await order.populate('items.product', 'name price imageUrl');
    res.status(201).json({ message: 'Pedido criado com sucesso', order });
  } catch (err) {
    if (err.message.includes('não encontrado') || err.message.includes('insuficiente')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// ── PATCH /orders/:id/status ──────────────────────────────────
// Apenas admin pode atualizar o status
router.patch('/:id/status', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem atualizar o status' });
    }

    const { status } = req.body;
    const validStatuses = ['criado', 'pago', 'enviado', 'entregue', 'cancelado'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status inválido. Use: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('items.product', 'name price');

    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json({ message: 'Status atualizado', order });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /orders/:id ────────────────────────────────────────
// Usuário cancela o próprio pedido (apenas se status = 'criado'); admin pode cancelar qualquer um
router.delete('/:id', async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') query.user = req.user._id;

    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    if (req.user.role !== 'admin' && order.status !== 'criado') {
      return res.status(400).json({ error: 'Apenas pedidos com status "criado" podem ser cancelados' });
    }

    await order.deleteOne();
    res.json({ message: 'Pedido cancelado com sucesso' });
  } catch (err) {
    next(err);
  }
});

export default router;
