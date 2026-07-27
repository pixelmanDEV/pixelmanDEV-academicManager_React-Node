import { IconSearch } from './Icons';

export default function Topbar({ searchTerm = '', onSearchChange }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <img
          src="/assets/img/TKA_CORES_POSITIVO-header.png"
          alt="Gestão Académica - Tech Academy"
          height="56"
          width="140"
          style={{ marginRight: 12 }}
        />
      </div>
      <div className="topbar-actions">
        <div className="topbar-search">
          <IconSearch />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
        <div className="topbar-user">
          <div className="user-avatar">L</div>
          <div className="user-info">
            <div className="name">Luís</div>
            <div className="role">Administrador</div>
          </div>
        </div>
      </div>
    </header>
  );
}
