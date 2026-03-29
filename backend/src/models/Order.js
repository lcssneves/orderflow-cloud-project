import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantidade mínima é 1'],
    },
    unitPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'O pedido deve ter ao menos um item',
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['criado', 'pago', 'enviado', 'entregue', 'cancelado'],
      default: 'criado',
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'pix', 'bank_slip'],
      default: 'credit_card',
    },
  },
  { timestamps: true }
);

// Calcular total automaticamente antes de salvar
orderSchema.pre('save', function (next) {
  this.total = this.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
