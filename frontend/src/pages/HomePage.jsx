import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    api.get('/products?limit=4')
      .then(({ data }) => setProducts(data.products))
      .catch(() => setError('Não foi possível carregar os produtos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <div className="hero-badge animate-slide-up">✦ Next-Gen E-commerce Experience</div>
          <h1 className="hero-title animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Tecnologia que<br />
            <span className="hero-highlight">Impulsiona seu Fluxo</span>
          </h1>
          <p className="hero-sub animate-slide-up" style={{ animationDelay: '0.2s' }}>
            OrderFlow é a solução definitiva para gestão de pedidos, integrando
            uma arquitetura de nuvem escalável com uma interface de usuário premium.
          </p>
          <div className="hero-cta animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/products" className="btn btn-primary">Explorar Catálogo</Link>
            <Link to="/register" className="btn btn-ghost">Criar Conta</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats container">
        <div className="stats-inner glass">
          <div className="stat-item">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Uptime Cloud</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">+10k</span>
            <span className="stat-label">Pedidos/dia</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">&lt; 100ms</span>
            <span className="stat-label">Latência API</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Destaques da Semana</h2>
            <p className="section-subtitle">Os produtos mais desejados da nossa coleção</p>
          </div>
          <Link to="/products" className="btn btn-ghost btn-sm">Ver todos →</Link>
        </div>

        {loading && (
          <div className="loading-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}

        {error && <div className="alert-error card">{error}</div>}

        {!loading && products.length === 0 && !error && (
          <div className="empty-state card glass">
            <div className="empty-icon">📦</div>
            <h3>Nenhum produto em destaque</h3>
            <p>Comece adicionando produtos ao catálogo.</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid-products">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Regras de Negócio */}
      <section className="tech-section">
        <div className="container">
          <div className="tech-header">
            <h2 className="section-title">Como funciona o OrderFlow</h2>
            <p className="section-subtitle">Regras simples para uma experiência de compra transparente</p>
          </div>
          <div className="tech-grid">
            <div className="tech-card glass">
              <span className="tech-icon">🛒</span>
              <h3>Carrinho Persistente</h3>
              <p>Seus itens ficam salvos mesmo se você fechar o navegador. Adicione, ajuste quantidades e finalize quando quiser.</p>
            </div>
            <div className="tech-card glass">
              <span className="tech-icon">📦</span>
              <h3>Rastreamento de Pedidos</h3>
              <p>Cada pedido passa pelos status: <strong>Criado → Pago → Enviado → Entregue</strong>. Acompanhe em tempo real.</p>
            </div>
            <div className="tech-card glass">
              <span className="tech-icon">🔒</span>
              <h3>Compras Seguras</h3>
              <p>Autenticação obrigatória para finalizar pedidos. Apenas administradores podem alterar o status dos pedidos.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

