import { useEffect, useState } from 'react';
import api from '../services/api';
import OrderCard from '../components/OrderCard';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchOrders = () => {
    setLoading(true);
    api.get('/orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setError('Erro ao carregar pedidos.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const pageTitle = user?.role === 'admin' ? 'Todos os Pedidos' : 'Meus Pedidos';

  const totalGasto = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const formatPrice = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <main className="orders-page container animate-slide-up">
      <header className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-sub">{orders.length} pedido(s) encontrado(s)</p>
        </div>
        {orders.length > 0 && user?.role !== 'admin' && (
          <div className="orders-summary-card glass">
            <span className="summary-label">Total Gasto</span>
            <span className="summary-value">{formatPrice(totalGasto)}</span>
          </div>
        )}
      </header>

      {error && <div className="alert-error card">{error}</div>}

      {loading ? (
        <div>
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-card" style={{ height: 260, marginBottom: '24px' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state card glass">
          <div className="empty-icon">📦</div>
          <h3>Nenhum pedido encontrado</h3>
          <p>Explore o catálogo e faça seu primeiro pedido!</p>
        </div>
      ) : (
        <div>
          {orders.map((o) => (
            <OrderCard key={o._id} order={o} onStatusChange={fetchOrders} />
          ))}
        </div>
      )}
    </main>
  );
}

