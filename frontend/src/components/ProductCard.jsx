import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const formatPrice = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();

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

      <div className="product-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <button
          className="btn btn-primary btn-add"
          style={{ flex: 1 }}
          disabled={product.stock === 0}
          onClick={() => addItem(product, 1)}
        >
          {product.stock === 0 ? 'Esgotado' : 'Carrinho'}
        </button>

        {user?.role === 'admin' && (
          <Link
            to={`/products/edit/${product._id}`}
            className="btn btn-ghost"
            style={{ width: '48px', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            title="Editar produto"
          >
            ✏️
          </Link>
        )}
      </div>
    </div>
  );
}
