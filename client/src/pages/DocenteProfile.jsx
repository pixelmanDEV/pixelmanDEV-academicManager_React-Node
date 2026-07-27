import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, formatTurma } from '../services/api';
import { IconArrowLeft, IconAvatar, IconMail, IconPhone, IconUsers, IconBook } from '../components/Icons';
import Tabs from '../components/Tabs';

export default function DocenteProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [docente, setDocente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getDocente(id)
      .then(setDocente)
      .catch(() => setDocente(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="empty-state"><h3>A carregar...</h3></div>;
  }

  if (!docente) {
    return <div className="empty-state"><h3>Docente não encontrado</h3></div>;
  }

  const horariosPreview = docente.horarios.slice(0, 15);

  const horariosContent = docente.horarios.length > 0 ? (
    <>
      <div className="data-table" style={{ marginTop: 24 }}>
        <table>
          <thead>
            <tr><th>Data</th><th>Dia</th><th>Início</th><th>Fim</th><th>Turma</th><th>Módulo</th></tr>
          </thead>
          <tbody>
            {horariosPreview.map((h, i) => (
              <tr key={i}>
                <td>{h.data}</td>
                <td><span className="dia-badge">{h.dia}</span></td>
                <td>{h.inicio}</td>
                <td>{h.fim}</td>
                <td>{formatTurma(h.turma)}</td>
                <td>{h.modulo || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {docente.horarios.length > 15 && (
        <p style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-light)', fontSize: 13 }}>
          A mostrar 15 de {docente.horarios.length} aulas
        </p>
      )}
    </>
  ) : (
    <div className="empty-state"><h3>Sem horários registados</h3></div>
  );

  const tabs = [
    {
      id: 'docente-bio',
      label: 'Bio & Contactos',
      content: (
        <div className="info-grid">
          <div className="info-card"><div className="info-card-label">Nome</div><div className="info-card-value">{docente.nome}</div></div>
          <div className="info-card"><div className="info-card-label">Email</div><div className="info-card-value">{docente.email || 'N/A'}</div></div>
          <div className="info-card"><div className="info-card-label">Telefone</div><div className="info-card-value">{docente.telefone || 'N/A'}</div></div>
          <div className="info-card"><div className="info-card-label">Total de Aulas</div><div className="info-card-value">{docente.horarios_count}</div></div>
        </div>
      ),
    },
    {
      id: 'docente-turmas',
      label: 'Turmas',
      content: (
        <div className="info-grid">
          {docente.turmas.map((t) => (
            <div key={t} className="info-card" onClick={() => navigate(`/turmas/${t}`)}>
              <div className="info-card-label">Turma</div>
              <div className="info-card-value" style={{ color: 'var(--primary)' }}>{formatTurma(t)}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'docente-modulos',
      label: 'Módulos',
      content: (
        <div className="info-grid">
          {docente.modulos.map((m, i) => (
            <div key={i} className="info-card"><div className="info-card-value" style={{ fontSize: 14 }}>{m}</div></div>
          ))}
        </div>
      ),
    },
    {
      id: 'docente-horarios',
      label: 'Horários',
      content: horariosContent,
    },
  ];

  return (
    <>
      <div className="list-header">
        <h2>Perfil do Docente</h2>
        <button className="back-btn" onClick={() => navigate('/docentes')}>
          <IconArrowLeft /> Voltar à lista
        </button>
      </div>

      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar"><IconAvatar /></div>
          <div className="profile-info">
            <h2>{docente.nome}</h2>
            <div className="profile-meta">
              {docente.email && <div className="profile-meta-item"><IconMail />{docente.email}</div>}
              {docente.telefone && <div className="profile-meta-item"><IconPhone />{docente.telefone}</div>}
              <div className="profile-meta-item"><IconUsers />{docente.turmas.length} turmas</div>
              <div className="profile-meta-item"><IconBook />{docente.modulos.length} módulos</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} />
    </>
  );
}
