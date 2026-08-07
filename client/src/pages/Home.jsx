import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  IconAvatar,
  IconUsers,
  IconUser,
  IconArrowRight,
  IconCap,
  IconBriefcase,
  IconSupport,
  IconBook,
  IconNews,
} from '../components/Icons';

export default function Home() {
  const navigate = useNavigate();

  const [syncing, setSyncing] = useState(false);
  const [driveStatus, setDriveStatus] = useState({ configured: false });

  useEffect(() => {
    api.getDriveStatus()
      .then(setDriveStatus)
      .catch(err => console.error('Erro ao verificar status do Drive:', err));
  }, []);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const result = await api.sync();
      alert(result.message);
    } catch (error) {
      alert('Erro na sincronização: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <div className="welcome" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="welcome-avatar"><IconAvatar /></div>
          <div className="welcome-text">
            <h2>Olá Luís</h2>
            <p>Painel inicial</p>
          </div>
        </div>
        
        <button 
          onClick={handleSync} 
          disabled={syncing}
          className="sync-btn-small"
          title="Sincronizar com Google Drive"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: syncing ? 'spin 2s linear infinite' : 'none', marginRight: syncing ? '8px' : '0' }}>
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
          </svg>
          {syncing ? 'A sincronizar...' : ''}
          {!syncing && <span style={{ marginLeft: '8px', fontSize: '12px' }}>Sincronizar</span>}
        </button>
      </div>

      <h3 className="section-title">Gestão Académica</h3>

      {!driveStatus.configured && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeeba', 
          borderRadius: 'var(--radius-sm)', 
          color: '#856404', 
          marginBottom: '24px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <strong>Atenção:</strong> A ligação ao Google Drive não está configurada. 
            Configure o ficheiro <code>.env</code> no servidor para ativar a sincronização.
          </div>
        </div>
      )}

      <div className="cards-grid">
        <div className="card" onClick={() => navigate('/turmas')}>
          <div className="card-icon"><IconUsers /></div>
          <h3>Turmas</h3>
          <div className="card-divider"></div>
          <p>Consulte as turmas, alunos, horários e pautas de notas.</p>
          <div className="card-footer"><span>Aceder</span><IconArrowRight /></div>
          <div className="card-decoration"><IconCap /></div>
        </div>
        <div className="card" onClick={() => navigate('/docentes')}>
          <div className="card-icon"><IconUser /></div>
          <h3>Docentes</h3>
          <div className="card-divider"></div>
          <p>Consulte os docentes, informações, turmas e módulos atribuídos.</p>
          <div className="card-footer"><span>Aceder</span><IconArrowRight /></div>
          <div className="card-decoration"><IconBriefcase /></div>
        </div>
      </div>

      <h3 className="section-title">Apoio e Recursos</h3>
      <div className="cards-grid">
        <div className="card" style={{ background: 'linear-gradient(135deg, #1a1f5c, #0a0e3d)' }}>
          <div className="card-icon"><IconSupport /></div>
          <h3>Suporte</h3>
          <div className="card-divider"></div>
          <p>Precisa de ajuda? Estamos aqui para si.</p>
          <div className="card-footer"><span>Aceder</span><IconArrowRight /></div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1a1f5c, #0a0e3d)' }}>
          <div className="card-icon"><IconBook /></div>
          <h3>Guias e Tutoriais</h3>
          <div className="card-divider"></div>
          <p>Tutoriais e guias de utilização da plataforma.</p>
          <div className="card-footer"><span>Aceder</span><IconArrowRight /></div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1a1f5c, #0a0e3d)' }}>
          <div className="card-icon"><IconNews /></div>
          <h3>Notícias</h3>
          <div className="card-divider"></div>
          <p>Fique a par das últimas novidades e comunicados.</p>
          <div className="card-footer"><span>Aceder</span><IconArrowRight /></div>
        </div>
      </div>

      <style>{`
        .sync-btn-small {
          display: flex;
          align-items: center;
          padding: 6px 12px;
          background-color: rgba(255, 255, 255, 0.1);
          color: var(--primary);
          border: 1px solid var(--border);
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition);
          background: white;
        }
        .sync-btn-small:hover:not(:disabled) {
          background-color: var(--bg);
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        .sync-btn-small:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
