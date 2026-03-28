import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function NewOrderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'geral',
    description: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/orders', formData);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar solicitação.');
      setLoading(false);
    }
  };

  return (
    <main className="container animate-slide-up" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '600px' }}>
      <header className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="page-title">Nova Solicitação</h1>
        <p className="page-sub">Preencha os detalhes para abrir um chamado interno.</p>
      </header>

      {error && <div className="alert-error card" style={{ marginBottom: '24px' }}>{error}</div>}

      <form className="card glass" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título / Resumo do Problema</label>
          <input
            type="text"
            name="title"
            required
            placeholder="Ex: Teclado não funciona, Criação de banner..."
            value={formData.title}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: '#fff' }}
          />
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label>Categoria do Serviço</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: '#fff' }}
          >
            <option value="suporte_ti">Suporte de TI</option>
            <option value="manutencao">Manutenção</option>
            <option value="design">Marketing / Design</option>
            <option value="geral">Solicitação Geral</option>
          </select>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label>Descrição Detalhada</label>
          <textarea
            name="description"
            required
            rows="5"
            placeholder="Descreva o problema, o motivo da solicitação ou o que você precisa que seja feito de forma clara."
            value={formData.description}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: '#fff', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Enviando...' : 'Abrir Chamado'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/orders')}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}
