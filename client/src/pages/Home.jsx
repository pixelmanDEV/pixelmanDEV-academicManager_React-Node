import { useNavigate } from 'react-router-dom';
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
