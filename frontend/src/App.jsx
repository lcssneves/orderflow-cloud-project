import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage      from './pages/HomePage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import ProductsPage  from './pages/ProductsPage';
import OrdersPage    from './pages/OrdersPage';
import NewProductPage from './pages/NewProductPage';
import CartPage      from './pages/CartPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner" style={{ width:32, height:32 }} /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/products"     element={<ProductsPage />} />
          <Route path="/cart"         element={<CartPage />} />
          <Route path="/login"        element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"     element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/orders"       element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path="/products/new" element={<PrivateRoute><NewProductPage /></PrivateRoute>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

