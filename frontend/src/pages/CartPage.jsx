import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';
import './CartPage.css';

const formatPrice = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    if (items.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
        paymentMethod,
      };
      await api.post('/orders', payload);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao finalizar pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="cart-page container animate-slide-up">
        <h1 className="page-title">Meu Carrinho</h1>
        <div className="empty-state card glass" style={{ marginTop: '40px' }}>
          <div className="empty-icon">🛒</div>
          <h3>Seu carrinho está vazio</h3>
          <p>Adicione produtos do catálogo para continuar.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '16px' }}>
            Explorar Catálogo
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page container animate-slide-up">
      <h1 className="page-title">Meu Carrinho</h1>

      {error && <div className="alert-error card" style={{ marginBottom: '24px' }}>{error}</div>}

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="cart-item card glass">
              <div className="cart-item-info">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="cart-item-img" />
                ) : (
                  <div className="cart-item-img cart-item-img-placeholder">📦</div>
                )}
                <div>
                  <p className="cart-item-name">{product.name}</p>
                  <p className="cart-item-price">{formatPrice(product.price)} / un.</p>
                </div>
              </div>

              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQuantity(product._id, quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
                </div>
                <span className="cart-item-subtotal">{formatPrice(product.price * quantity)}</span>
                <button className="remove-btn" onClick={() => removeItem(product._id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary card glass">
          <h2 className="summary-title">Resumo</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Frete</span>
            <span className="free-shipping">Grátis</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <div className="payment-method-select" style={{ marginTop: '24px' }}>
            <p className="summary-title" style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Método de Pagamento</p>
            <div className="payment-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                className={`btn btn-sm ${paymentMethod === 'credit_card' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setPaymentMethod('credit_card')}
                style={{ fontSize: '0.75rem' }}
              >
                💳 Crédito
              </button>
              <button 
                className={`btn btn-sm ${paymentMethod === 'debit_card' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setPaymentMethod('debit_card')}
                style={{ fontSize: '0.75rem' }}
              >
                🏦 Débito
              </button>
              <button 
                className={`btn btn-sm ${paymentMethod === 'pix' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setPaymentMethod('pix')}
                style={{ fontSize: '0.75rem', gridColumn: 'span 2' }}
              >
                💎 Pix
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Finalizando...' : 'Finalizar Pedido'}
          </button>

          <button
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: '8px', fontSize: '0.85rem' }}
            onClick={() => navigate('/products')}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    </main>
  );
}
