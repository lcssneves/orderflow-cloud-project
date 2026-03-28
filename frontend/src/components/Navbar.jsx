import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate  = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-text">Order<strong>Flow</strong></span>
        </Link>

        <div className="navbar-links">
          <Link to="/"         className={`nav-link ${isActive('/')         ? 'active' : ''}`}>Início</Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Catálogo</Link>
          {user && (
            <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
              {user.role === 'admin' ? 'Todos os Pedidos' : 'Meus Pedidos'}
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn" aria-label="Carrinho">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

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
      </div>
    </nav>
  );
}

