import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate  = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar glass">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
          <span className="brand-icon">⬡</span>
          <span className="brand-text">Order<strong>Flow</strong></span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links desktop-only">
          <Link to="/"         className={`nav-link ${isActive('/')         ? 'active' : ''}`}>Início</Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Catálogo</Link>
          {user && (
            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
              {user.role === 'admin' ? 'Todos os Pedidos' : 'Meus Pedidos'}
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" aria-label="Carrinho" onClick={() => setIsMenuOpen(false)}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Desktop Auth */}
          <div className="auth-wrap desktop-only">
            {user ? (
              <div className="user-menu">
                <span className="nav-user">Olá, <strong>{user.name.split(' ')[0]}</strong></span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sair</button>
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login"    className="btn btn-ghost btn-sm">Entrar</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Criar Conta</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-menu glass ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-inner">
          <Link to="/"         className={`mobile-link ${isActive('/') ? 'active' : ''}`} onClick={toggleMenu}>Início</Link>
          <Link to="/products" className={`mobile-link ${isActive('/products') ? 'active' : ''}`} onClick={toggleMenu}>Catálogo</Link>
          {user && (
            <Link to="/orders" className={`mobile-link ${isActive('/orders') ? 'active' : ''}`} onClick={toggleMenu}>
              {user.role === 'admin' ? 'Todos os Pedidos' : 'Meus Pedidos'}
            </Link>
          )}
          
          <hr className="mobile-divider" />
          
          {user ? (
            <div className="mobile-user-info">
              <span className="mobile-user-text">Olá, {user.name}</span>
              <button className="btn btn-primary btn-sm w-full" onClick={handleLogout}>Sair da Conta</button>
            </div>
          ) : (
            <div className="mobile-auth-stack">
              <Link to="/login"    className="btn btn-ghost btn-sm w-full" onClick={toggleMenu}>Entrar</Link>
              <Link to="/register" className="btn btn-primary btn-sm w-full" onClick={toggleMenu}>Criar Conta</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

