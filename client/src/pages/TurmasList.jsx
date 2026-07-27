import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { IconArrowLeft } from '../components/Icons';

export default function TurmasList() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTurmas().then((data) => {
      setTurmas(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="empty-state"><h3>A carregar...</h3></div>;
  }

  return (
    <>
      <div className="list-header">
        <h2>Turmas</h2>
        <button className="back-btn" onClick={() => navigate('/')}>
          <IconArrowLeft /> Voltar
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-box"><div className="stat-box-value">{turmas.length}</div><div className="stat-box-label">Turmas</div></div>
        <div className="stat-box"><div className="stat-box-value">31</div><div className="stat-box-label">Docentes</div></div>
        <div className="stat-box"><div className="stat-box-value">1253</div><div className="stat-box-label">Aulas</div></div>
        <div className="stat-box"><div className="stat-box-value">28</div><div className="stat-box-label">Módulos Únicos</div></div>
      </div>

      <div className="cards-grid">
        {turmas.map((turma) => (
          <div key={turma.id} className="turma-card" onClick={() => navigate(`/turmas/${turma.id}`)}>
            <div className="turma-card-header">
              <div className="turma-card-title">{turma.nome}</div>
              <span className="badge badge-primary">{turma.aulas_count} aulas</span>
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
    </>
  );
}
