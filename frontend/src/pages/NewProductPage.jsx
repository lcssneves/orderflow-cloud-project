import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './NewProductPage.css';

export default function NewProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-product-page container">
      <div className="np-header">
        <Link to="/products" className="back-link">← Voltar</Link>
        <h1 className="page-title">Novo Produto</h1>
      </div>

      <div className="np-card animate-fade-up">
        {error && <div className="auth-error">{error}</div>}

        <form className="np-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label className="label">Nome *</label>
              <input
                className="input" type="text" name="name"
                placeholder="Nome do produto"
                value={form.name} onChange={handleChange} required
              />
            </div>
            <div className="field">
              <label className="label">Categoria</label>
              <input
                className="input" type="text" name="category"
                placeholder="Ex: Eletrônicos"
                value={form.category} onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Descrição</label>
            <textarea
              className="input textarea" name="description"
              placeholder="Descrição do produto..."
              value={form.description} onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label className="label">Preço (R$) *</label>
              <input
                className="input" type="number" name="price"
                placeholder="0.00" min="0" step="0.01"
                value={form.price} onChange={handleChange} required
              />
            </div>
            <div className="field">
              <label className="label">Estoque *</label>
              <input
                className="input" type="number" name="stock"
                placeholder="0" min="0"
                value={form.stock} onChange={handleChange} required
              />
            </div>
          </div>

          <div className="np-actions">
            <Link to="/products" className="btn btn-ghost">Cancelar</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
