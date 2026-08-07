import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { IconArrowLeft, IconPlus, IconTrash, IconEdit } from '../components/Icons';
import Modal from '../components/Modal';

export default function TurmasList() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTurma, setCurrentTurma] = useState({ id: '', nome: '', nome_completo: '', docentes: [], modulos: [] });
  const [isEditing, setIsEditing] = useState(false);

  const loadTurmas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTurmas();
      setTurmas(data);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTurmas();
  }, [loadTurmas]);

  const handleOpenAdd = () => {
    setCurrentTurma({ id: '', nome: '', nome_completo: '', docentes: [], modulos: [] });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, turma) => {
    e.stopPropagation();
    setCurrentTurma(turma);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Tem a certeza que deseja remover esta turma?')) {
      try {
        await api.deleteTurma(id);
        loadTurmas();
      } catch (error) {
        alert('Erro ao remover turma');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateTurma(currentTurma.id, currentTurma);
      } else {
        await api.createTurma(currentTurma);
      }
      setIsModalOpen(false);
      loadTurmas();
    } catch (error) {
      alert('Erro ao guardar turma');
    }
  };

  if (loading && turmas.length === 0) {
    return <div className="empty-state"><h3>A carregar...</h3></div>;
  }

  return (
    <>
      <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2>Turmas</h2>
          <button className="add-btn-small" onClick={handleOpenAdd}>
            <IconPlus /> Adicionar
          </button>
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>
          <IconArrowLeft /> Voltar
        </button>
      </div>

      <div className="cards-grid">
        {turmas.map((turma) => (
          <div key={turma.id} className="turma-card" onClick={() => navigate(`/turmas/${turma.id}`)}>
            <div className="turma-card-header">
              <div className="turma-card-title">{turma.nome}</div>
              <div className="turma-card-actions">
                <button className="action-btn edit" onClick={(e) => handleOpenEdit(e, turma)}><IconEdit /></button>
                <button className="action-btn delete" onClick={(e) => handleDelete(e, turma.id)}><IconTrash /></button>
              </div>
            </div>
            <div className="turma-card-stats">
              <div className="turma-stat"><div className="turma-stat-value">{turma.docentes.length}</div><div className="turma-stat-label">Docentes</div></div>
              <div className="turma-stat"><div className="turma-stat-value">{turma.modulos.length}</div><div className="turma-stat-label">Módulos</div></div>
            </div>
            <div className="turma-card-modules">
              <div className="turma-card-modules-title">Módulos</div>
              <div className="module-tags">
                {turma.modulos.slice(0, 5).map((m, i) => (
                  <span key={i} className="module-tag">
                    {m.substring(0, 35)}{m.length > 35 ? '...' : ''}
                  </span>
                ))}
                {turma.modulos.length > 5 && (
                  <span className="module-tag">+{turma.modulos.length - 5}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? 'Editar Turma' : 'Adicionar Turma'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID da Turma (ex: CET_TSI_ONL_01)</label>
            <input 
              type="text" 
              required 
              disabled={isEditing}
              value={currentTurma.id} 
              onChange={e => setCurrentTurma({...currentTurma, id: e.target.value, nome_completo: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Nome Curto (ex: TSI01)</label>
            <input 
              type="text" 
              required 
              value={currentTurma.nome} 
              onChange={e => setCurrentTurma({...currentTurma, nome: e.target.value})}
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
        .turma-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .turma-card-actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: rgba(255, 255, 255, 0.6);
          transition: var(--transition);
        }
        .action-btn:hover.edit { color: white; }
        .action-btn:hover.delete { color: var(--accent); }
        .action-btn svg { width: 16px; height: 16px; }
      `}</style>
    </>
  );
}
