import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return setError('Senha deve ter ao menos 6 caracteres');
    }
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card animate-fade-up">
        <div className="auth-header">
          <span className="auth-icon">⬡</span>
          <h1 className="auth-title">Criar conta</h1>
          <p className="auth-sub">Comece a usar o OrderFlow hoje</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Nome</label>
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label">E-mail</label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label">Senha</label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Criar Conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem conta?{' '}
          <Link to="/login" className="auth-link">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
