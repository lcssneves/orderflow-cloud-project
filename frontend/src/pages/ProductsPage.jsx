import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './ProductsPage.css';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products', { params: { search, limit: 50 } })
      .then(({ data }) => setProducts(data.products))
      .catch(() => setError('Não foi possível carregar os produtos.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main className="products-page container animate-slide-up">
      <header className="page-header">
        <div className="header-title">
          <h1 className="page-title">Catálogo</h1>
          <p className="page-sub">{products.length} produto(s) disponíveis</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {user?.role === 'admin' && (
            <Link to="/products/new" className="btn btn-primary btn-sm">+ Novo</Link>
          )}
        </div>
      </header>

      {error && <div className="alert-error card">{error}</div>}

      {loading ? (
        <div className="products-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card" style={{ height: 320 }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state card glass">
          <div className="empty-icon">📦</div>
          <h3>Nenhum produto encontrado</h3>
          <p>Tente outro termo de busca ou aguarde novos produtos.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
