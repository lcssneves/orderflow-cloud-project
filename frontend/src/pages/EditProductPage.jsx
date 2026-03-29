import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './NewProductPage.css'; // Reutilizando os mesmos estilos

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category: '', imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.product.name || '',
          description: data.product.description || '',
          price: data.product.price || '',
          stock: data.product.stock || '',
          category: data.product.category || '',
          imageUrl: data.product.imageUrl || ''
        });
      })
      .catch(() => setError('Erro ao carregar dados do produto.'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}><div className="spinner" /></div>;

  return (
    <main className="new-product-page container">
      <div className="np-header">
        <Link to="/products" className="back-link">← Voltar</Link>
        <h1 className="page-title">Editar Produto</h1>
      </div>

      <div className="np-card animate-fade-up">
        {error && <div className="auth-error" style={{ marginBottom: '20px', color: 'var(--accent-red)' }}>{error}</div>}

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

          <div className="field">
            <label className="label">URL da Imagem</label>
            <input
              className="input" type="text" name="imageUrl"
              placeholder="https://exemplo.com/imagem.png"
              value={form.imageUrl} onChange={handleChange}
            />
          </div>

          <div className="np-actions">
            <Link to="/products" className="btn btn-ghost">Cancelar</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
