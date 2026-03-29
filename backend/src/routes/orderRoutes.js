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

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: ['criado', 'pago', 'enviado', 'entregue', 'cancelado'] }
 *     responses:
 *       200:
 *         description: Lista de pedidos (Admin vê todos, Usuário vê apenas os seus)
 */
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

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obter detalhes de um pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Não encontrado ou sem permissão
 */
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

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Finalizar pedido (Checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shippingAddress]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     quantity: { type: integer }
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   city: { type: string }
 *                   state: { type: string }
 *                   zipCode: { type: string }
 *               paymentMethod: { type: string, enum: ['credit_card', 'debit_card', 'pix'] }
 *     responses:
 *       201:
 *         description: Pedido criado e estoque atualizado
 */
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

    // Baixa de estoque
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    await order.populate('items.product', 'name price imageUrl');
    res.status(201).json({ message: 'Pedido criado com sucesso', order });
  } catch (err) {
    if (err.message.includes('não encontrado') || err.message.includes('insuficiente')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: ['criado', 'pago', 'enviado', 'entregue', 'cancelado'] }
 *     responses:
 *       200:
 *         description: Status atualizado (repõe estoque se cancelado)
 */
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

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    // Se o status mudar para cancelado e não estava cancelado antes, devolver ao estoque
    if (status === 'cancelado' && order.status !== 'cancelado') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // Se mudar de cancelado PARA outra coisa (improvável, mas possível), tirar do estoque novamente?
    // Por simplicidade, assumiremos que cancelamento é irreversível ou que o admin ajusta manualmente se reverter.

    order.status = status;
    await order.save();
    
    await order.populate('user', 'name email');
    await order.populate('items.product', 'name price');

    res.json({ message: 'Status atualizado', order });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Cancelar/Excluir pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cancelado com sucesso (estoque reposto)
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') query.user = req.user._id;

    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    if (req.user.role !== 'admin' && order.status !== 'criado') {
      return res.status(400).json({ error: 'Apenas pedidos com status "criado" podem ser cancelados' });
    }

    // Devolver ao estoque se não estava cancelado
    if (order.status !== 'cancelado') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.deleteOne();
    res.json({ message: 'Pedido cancelado com sucesso' });
  } catch (err) {
    next(err);
  }
});

export default router;
