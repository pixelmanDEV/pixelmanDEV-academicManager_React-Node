import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DocentesList from './pages/DocentesList';
import DocenteProfile from './pages/DocenteProfile';
import TurmasList from './pages/TurmasList';
import TurmaDetail from './pages/TurmaDetail';

export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Topbar />

        <div className="content" id="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docentes" element={<DocentesList />} />
            <Route path="/docentes/:id" element={<DocenteProfile />} />
            <Route path="/turmas" element={<TurmasList />} />
            <Route path="/turmas/:id" element={<TurmaDetail />} />
            <Route path="*" element={<div className="empty-state"><h3>Página em construção</h3></div>} />
          </Routes>
        </div>

        <Footer />
      </main>
    </div>
  );
}
