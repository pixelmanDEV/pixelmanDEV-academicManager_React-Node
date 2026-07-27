import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { IconArrowLeft, IconWarning } from '../components/Icons';
import Tabs from '../components/Tabs';

export default function TurmaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turma, setTurma] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getTurma(id)
      .then(setTurma)
      .catch(() => setTurma(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="empty-state"><h3>A carregar...</h3></div>;
  }

  if (!turma) {
    return <div className="empty-state"><h3>Turma não encontrada</h3></div>;
  }

  const tabs = [
    {
      id: 'turma-docentes',
      label: 'Docentes',
      content: (
        <div className="data-table">
          <table>
            <thead><tr><th>Nome</th><th>Email</th><th>Módulos</th></tr></thead>
            <tbody>
              {turma.docentes.map((d) => {
                const doc = turma.docentesData?.[d];
                return (
                  <tr key={d} onClick={() => navigate(`/docentes/${d}`)}>
                    <td><strong>{d}</strong></td>
                    <td>{doc?.email || '-'}</td>
                    <td><span className="badge badge-primary">{doc?.modulos?.length || 0}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: 'turma-modulos',
      label: 'Módulos',
      content: (
        <div className="info-grid">
          {turma.modulos.map((m, i) => (
            <div key={i} className="info-card"><div className="info-card-value" style={{ fontSize: 14 }}>{m}</div></div>
          ))}
        </div>
      ),
    },
    {
      id: 'turma-horarios',
      label: 'Horários',
      content: (
        <div className="empty-state">
          <IconWarning />
          <h3>Horários em desenvolvimento</h3>
          <p>Esta secção será preenchida com dados da Google Drive.</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="list-header">
        <h2>{turma.nome}</h2>
        <button className="back-btn" onClick={() => navigate('/turmas')}>
          <IconArrowLeft /> Voltar
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-box"><div className="stat-box-value">{turma.docentes.length}</div><div className="stat-box-label">Docentes</div></div>
        <div className="stat-box"><div className="stat-box-value">{turma.modulos.length}</div><div className="stat-box-label">Módulos</div></div>
        <div className="stat-box"><div className="stat-box-value">{turma.aulas_count}</div><div className="stat-box-label">Aulas</div></div>
        <div className="stat-box"><div className="stat-box-value">ONL</div><div className="stat-box-label">Modalidade</div></div>
      </div>

      <Tabs tabs={tabs} />
    </>
  );
}
