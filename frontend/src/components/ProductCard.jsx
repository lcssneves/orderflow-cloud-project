import { useCart } from '../context/CartContext';
import './ProductCard.css';

const formatPrice = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card card glass animate-slide-up">
      <div className="product-img-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-img" />
        ) : (
          <div className="product-img-placeholder">📦</div>
        )}
      </div>

      <div className="product-info">
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-stock">
            {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
          </span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-add"
        disabled={product.stock === 0}
        onClick={() => addItem(product, 1)}
      >
        {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
      </button>
    </div>
  );
}
