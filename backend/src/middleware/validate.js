/**
 * Middleware de validação centralizado.
 * Exporta funções específicas para cada entidade.
 */

export const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  const errors = [];

  if (!name || name.trim() === '') errors.push('Nome é obrigatório');
  if (price === undefined || price === null) errors.push('Preço é obrigatório');
  if (price !== undefined && price < 0) errors.push('Preço não pode ser negativo');

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }
  next();
};

export const validateOrder = (req, res, next) => {
  const { items } = req.body;
  const errors = [];

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('O pedido deve conter ao menos um item');
  } else {
    items.forEach((item, i) => {
      if (!item.productId) errors.push(`Item ${i + 1}: productId é obrigatório`);
      if (!item.quantity || item.quantity < 1) errors.push(`Item ${i + 1}: quantidade mínima é 1`);
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }
  next();
};
