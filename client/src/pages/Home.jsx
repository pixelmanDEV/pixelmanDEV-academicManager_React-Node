import { useState } from 'react';
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
      <div className="welcome">
        <div className="welcome-avatar"><IconAvatar /></div>
        <div className="welcome-text">
          <h2>Olá Luís</h2>
          <p>Painel inicial</p>
        </div>
      </div>

      <h3 className="section-title">Gestão Académica</h3>
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
        <div className="card" onClick={handleSync} style={{ opacity: syncing ? 0.7 : 1 }}>
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: syncing ? 'spin 2s linear infinite' : 'none' }}>
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
            </svg>
          </div>
          <h3>Sincronizar</h3>
          <div className="card-divider"></div>
          <p>{syncing ? 'A sincronizar dados com o Google Drive...' : 'Atualizar dados a partir das folhas de cálculo do Google Drive.'}</p>
          <div className="card-footer"><span>{syncing ? 'A processar...' : 'Sincronizar agora'}</span><IconArrowRight /></div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
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
    </>
  );
}
