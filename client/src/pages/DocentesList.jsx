import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { IconArrowLeft, IconPlus, IconTrash, IconEdit } from '../components/Icons';
import Modal from '../components/Modal';

export default function DocentesList() {
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocente, setCurrentDocente] = useState({ nome: '', email: '', telefone: '', turmas: [], modulos: [] });
  const [isEditing, setIsEditing] = useState(false);

  const loadDocentes = useCallback(async (term = '') => {
    setLoading(true);
    try {
      const data = await api.getDocentes(term);
      setDocentes(data);
    } catch (error) {
      console.error('Erro ao carregar docentes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocentes();
  }, [loadDocentes]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    loadDocentes(term);
  };

  const handleOpenAdd = () => {
    setCurrentDocente({ nome: '', email: '', telefone: '', turmas: [], modulos: [] });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, docente) => {
    e.stopPropagation();
    setCurrentDocente(docente);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Tem a certeza que deseja remover este docente?')) {
      try {
        await api.deleteDocente(id);
        loadDocentes(searchTerm);
      } catch (error) {
        alert('Erro ao remover docente');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateDocente(currentDocente.id, currentDocente);
      } else {
        await api.createDocente(currentDocente);
      }
      setIsModalOpen(false);
      loadDocentes(searchTerm);
    } catch (error) {
      alert('Erro ao guardar docente');
    }
  };

  if (loading && docentes.length === 0) {
    return <div className="empty-state"><h3>A carregar...</h3></div>;
  }

  return (
    <>
      <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2>Docentes</h2>
          <button className="add-btn-small" onClick={handleOpenAdd}>
            <IconPlus /> Adicionar
          </button>
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>
          <IconArrowLeft /> Voltar
        </button>
      </div>

      <div className="topbar-search" style={{ maxWidth: 320, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Pesquisar docentes..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th><th>Email</th><th>Telefone</th><th>Turmas</th><th>Aulas</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((doc) => (
              <tr key={doc.id} onClick={() => navigate(`/docentes/${doc.id}`)}>
                <td><strong>{doc.nome}</strong></td>
                <td>{doc.email || '-'}</td>
                <td>{doc.telefone || '-'}</td>
                <td>{doc.turmasFormatadas?.join(', ') || '-'}</td>
                <td><span className="badge badge-success">{doc.horarios_count || 0} aulas</span></td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn edit" onClick={(e) => handleOpenEdit(e, doc)}><IconEdit /></button>
                    <button className="action-btn delete" onClick={(e) => handleDelete(e, doc.id)}><IconTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? 'Editar Docente' : 'Adicionar Docente'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input 
              type="text" 
              required 
              value={currentDocente.nome} 
              onChange={e => setCurrentDocente({...currentDocente, nome: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={currentDocente.email} 
              onChange={e => setCurrentDocente({...currentDocente, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input 
              type="text" 
              value={currentDocente.telefone} 
              onChange={e => setCurrentDocente({...currentDocente, telefone: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>

      <style>{`
        .add-btn-small {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        .table-actions {
          display: flex;
          gap: 12px;
        }
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: var(--text-light);
          transition: var(--transition);
        }
        .action-btn:hover.edit { color: var(--primary); }
        .action-btn:hover.delete { color: var(--accent); }
        .action-btn svg { width: 18px; height: 18px; }
      `}</style>
    </>
  );
}
