import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { IconArrowLeft } from '../components/Icons';

export default function DocentesList() {
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDocentes().then((data) => {
      setDocentes(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term);
    const data = await api.getDocentes(term);
    setDocentes(data);
  }, []);

  if (loading) {
    return <div className="empty-state"><h3>A carregar...</h3></div>;
  }

  const totalDocentes = docentes.length;
  const totalTurmas = new Set(docentes.flatMap((d) => d.turmas)).size;
  const totalModulos = new Set(docentes.flatMap((d) => d.modulos)).size;
  const totalAulas = docentes.reduce((sum, d) => sum + d.horarios_count, 0);

  return (
    <>
      <div className="list-header">
        <h2>Docentes</h2>
        <button className="back-btn" onClick={() => navigate('/')}>
          <IconArrowLeft /> Voltar
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-box"><div className="stat-box-value">{totalDocentes}</div><div className="stat-box-label">Docentes</div></div>
        <div className="stat-box"><div className="stat-box-value">{totalTurmas}</div><div className="stat-box-label">Turmas</div></div>
        <div className="stat-box"><div className="stat-box-value">{totalModulos}</div><div className="stat-box-label">Módulos</div></div>
        <div className="stat-box"><div className="stat-box-value">{totalAulas}</div><div className="stat-box-label">Aulas</div></div>
      </div>

      {/* Campo de pesquisa local (equivalente ao input da topbar no projeto original) */}
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
              <th>Nome</th><th>Email</th><th>Telefone</th><th>Turmas</th><th>Módulos</th><th>Aulas</th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((doc) => (
              <tr key={doc.id} onClick={() => navigate(`/docentes/${doc.id}`)}>
                <td><strong>{doc.nome}</strong></td>
                <td>{doc.email || '-'}</td>
                <td>{doc.telefone || '-'}</td>
                <td>{doc.turmasFormatadas.join(', ')}</td>
                <td><span className="badge badge-primary">{doc.modulos.length} módulos</span></td>
                <td><span className="badge badge-success">{doc.horarios_count} aulas</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
