import './OrderCard.css';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const formatPrice = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const formatDate = (d) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(d));

const STATUS_LABEL = {
  criado:    'Criado',
  pago:      'Pago',
  enviado:   'Enviado',
  entregue:  'Entregue',
  cancelado: 'Cancelado',
};

const PAYMENT_LABEL = {
  credit_card: 'Cartão de Crédito',
  pix:         'PIX',
  bank_slip:   'Boleto Bancário',
};

export default function OrderCard({ order, onStatusChange }) {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${order._id}/status`, { status: e.target.value });
      if (onStatusChange) onStatusChange();
    } catch {
      alert('Erro ao atualizar status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="order-card card glass animate-slide-up">
      <div className="order-card-header">
        <div className="order-main-info">
          <span className="order-id">Pedido #{order._id.slice(-6).toUpperCase()}</span>
          <span className="order-date">{formatDate(order.createdAt)}</span>
          {user?.role === 'admin' && order.user?.name && (
            <span className="order-date">Cliente: <strong>{order.user.name}</strong></span>
          )}
        </div>

        {user?.role === 'admin' ? (
          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updating}
            className="status-select"
          >
            {Object.entries(STATUS_LABEL).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        ) : (
          <span className={`badge badge-${order.status}`}>
            {STATUS_LABEL[order.status] || order.status}
          </span>
        )}
      </div>

      <div className="order-details-grid">
        <div className="order-section">
          <h4 className="section-title">Itens do Pedido</h4>
          <ul className="order-items">
            {order.items?.map((item, i) => (
              <li key={i} className="order-item">
                <span className="item-name">
                  {item.product?.name || 'Produto indisponível'}
                </span>
                <span className="item-qty">× {item.quantity}</span>
                <span className="item-price">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-section">
          {order.shippingAddress?.street && (
            <>
              <h4 className="section-title">Entrega</h4>
              <p className="order-info-text">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city} — {order.shippingAddress.state}<br />
                CEP: {order.shippingAddress.zipCode}
              </p>
            </>
          )}
          <h4 className="section-title" style={{ marginTop: '12px' }}>Pagamento</h4>
          <p className="order-info-text">
            {PAYMENT_LABEL[order.paymentMethod] || 'Cartão de Crédito'}
          </p>
        </div>
      </div>

      <div className="order-card-footer">
        <div className="total-container">
          <span className="order-total-label">Total do Pedido</span>
          <span className="order-total">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
