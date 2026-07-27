import { useLocation, useNavigate } from 'react-router-dom';
import { IconHome, IconUser, IconUsers } from './Icons';

const NAV_ITEMS = [
  { page: 'home', path: '/', title: 'Painel inicial', Icon: IconHome },
  { page: 'docentes', path: '/docentes', title: 'Docentes', Icon: IconUser },
  { page: 'turmas', path: '/turmas', title: 'Turmas', Icon: IconUsers },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeRoot = location.pathname.split('/')[1] || 'home';

  return (
    <aside className="sidebar">
      <div
        className="sidebar-logo"
        title="Gestão Académica -Tech Academy"
        onClick={() => navigate('/')}
      >
        <img src="/assets/img/favicon.ico" alt="Gestão Académica -Tech Academy" width="36" height="36" />
      </div>
      <nav>
        {NAV_ITEMS.map(({ page, path, title, Icon }) => (
          <div
            key={page}
            className={`nav-item ${activeRoot === page ? 'active' : ''}`}
            data-page={page}
            title={title}
            onClick={() => navigate(path)}
          >
            <Icon />
          </div>
        ))}
      </nav>
    </aside>
  );
}
