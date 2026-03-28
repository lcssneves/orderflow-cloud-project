import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Preço é obrigatório'],
      min: [0, 'Preço não pode ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'Estoque é obrigatório'],
      min: [0, 'Estoque não pode ser negativo'],
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      default: 'Geral',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
