# Campus Tech Academy — Plataforma de Gestão Académica

## 📋 Descrição

SPA (Single Page Application) para gestão académica do Campus Tech Academy.
Convertida para **React** (frontend) + **Node/Express** (backend API), mantendo
a mesma estrutura de página, design e dados do projeto original (vanilla JS).

## 🏗️ Arquitetura

```
campus-tech-academy/
├── package.json             # Scripts raiz (dev, build, install:all)
├── client/                  # Frontend React (Vite)
│   ├── index.html
│   ├── vite.config.js       # Proxy de /api para o backend em dev
│   ├── public/
│   │   └── assets/
│   │       ├── css/main.css     # Estilos originais (inalterados)
│   │       └── img/             # Imagens, favicon, logos
│   └── src/
│       ├── main.jsx          # Entry point (React Router)
│       ├── App.jsx           # Layout + rotas (equivalente ao antigo app.js)
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Topbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Tabs.jsx         # Equivalente ao switchTab()
│       │   └── Icons.jsx        # Ícones SVG (equivalente ao objeto icons)
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── DocentesList.jsx
│       │   ├── DocenteProfile.jsx
│       │   ├── TurmasList.jsx
│       │   └── TurmaDetail.jsx
│       └── services/
│           └── api.js           # Cliente HTTP (equivalente ao antigo DataService)
└── server/                   # Backend Node/Express
    ├── server.js              # Entry point da API
    ├── dataService.js         # Models + Repositories (Docente, Turma, Horario)
    ├── driveApi.js            # Stub Google Drive API (futuro)
    ├── routes/
    │   └── api.js              # Rotas REST (/api/docentes, /api/turmas, /api/horarios)
    └── data/
        ├── docentes.json
        ├── turmas.json
        └── horarios.json
```

## 🚀 Como usar

### 1. Instalar dependências
```bash
cd campus-tech-academy
npm run install:all
```

### 2. Correr em desenvolvimento (client + server em simultâneo)
```bash
npm run dev
```
- Backend (API): http://localhost:3001
- Frontend (React): http://localhost:5173

O Vite faz proxy automático de `/api/*` para o backend, por isso basta abrir
http://localhost:5173 no browser.

### 3. Correr separadamente (opcional)
```bash
npm run server   # apenas o backend, porta 3001
npm run client   # apenas o frontend, porta 5173
```

### 4. Build de produção do frontend
```bash
npm run build
```
Gera os ficheiros estáticos em `client/dist/`, prontos a servir por qualquer
servidor estático ou pelo próprio Express (bastaria adicionar
`express.static('../client/dist')` ao `server.js`).

## 🔌 API REST (backend)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/docentes` | Lista todos os docentes |
| GET | `/api/docentes?search=termo` | Pesquisa docentes por nome, email, turma ou módulo |
| GET | `/api/docentes/:id` | Detalhe de um docente |
| GET | `/api/turmas` | Lista todas as turmas |
| GET | `/api/turmas/:id` | Detalhe de uma turma (inclui dados dos docentes) |
| GET | `/api/horarios?docente=ID` | Horários de um docente |
| GET | `/api/horarios?turma=ID` | Horários de uma turma |
| GET | `/api/health` | Health check |

## 📊 Dados carregados

| Recurso | Quantidade | Fonte |
|---------|-----------|-------|
| Docentes | 31 | CET_TSI_HorárioAtual.xlsx |
| Turmas | 5 | CET_TSI_HorárioAtual.xlsx |
| Aulas | 943 | CET_TSI_HorárioAtual.xlsx |
| Módulos | 28 | lista_modulos_docentes_por_turma.xlsx |

## 🎨 Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `--primary` | `#0a0e3d` | Cards, sidebar active, headers |
| `--accent` | `#e63946` | Destaques, divisores, badges |
| `--bg` | `#f5f6fa` | Fundo da página |
| `--radius` | `12px` | Border radius padrão |
| `--shadow` | `0 4px 20px rgba(0,0,0,0.08)` | Cards |

O CSS (`client/public/assets/css/main.css`) foi mantido tal e qual o original —
o visual da aplicação não sofreu alterações.

## 🔄 Roadmap

### ✅ Fase 1 — Estrutura + UI
- [x] Painel inicial com cards
- [x] Lista de docentes com pesquisa
- [x] Perfil do docente (Bio, Contactos, Turmas, Módulos, Horários)
- [x] Lista de turmas com estatísticas
- [x] Página da turma (Docentes, Módulos, Horários placeholder)
- [x] Tema visual alinhado com a imagem
- [x] Dados reais dos Excel

### ✅ Fase 1.5 — Conversão para React + Node (ATUAL)
- [x] Frontend convertido para React (Vite + React Router)
- [x] Backend Node/Express com API REST
- [x] DataService/Repository pattern movido para o servidor
- [x] Mesma estrutura de pastas e nomenclatura do projeto original

### ✅ Fase 2 — Google Drive API
- [x] Configurar suporte para credenciais Google Cloud (Service Account / JWT)
- [x] Implementar `DriveAPIService` (`server/driveApi.js`) com suporte a `googleapis` e `xlsx`
- [x] Implementar rota de sincronização manual/automática (`/api/sync`)
- [x] Interface frontend para disparar sincronização
- [x] Cache local invalidado após sincronização bem-sucedida

### ⏳ Fase 3 — Autenticação e Roles
- [ ] Login com Google OAuth
- [ ] Roles: Admin vs Docente
- [ ] Restrições de acesso por role (middleware Express)
- [ ] Perfil do docente (visualização própria)

### ⏳ Fase 4 — Base de Dados Real
- [ ] Migrar `server/dataService.js` para Firebase/Supabase/Postgres
- [ ] Schema: docentes, turmas, alunos, módulos, horários
- [ ] API REST ou GraphQL
- [ ] Backup automático

### ⏳ Fase 5 — Notas, Presenças e Feedback
- [ ] Pautas de notas por módulo (editável)
- [ ] Registo de presenças (editável)
- [ ] Feedback dos docentes (editável)
- [ ] Log de edições (quem, quando, valor anterior)
- [ ] Exportação para Excel/PDF

## 🧩 Padrões de Código

### Camadas
```
Backend:
  Models + Repositories (server/dataService.js) → Estrutura de dados + acesso
  Routes (server/routes/api.js)                  → Endpoints REST

Frontend:
  services/api.js   → Cliente HTTP (equivalente ao antigo DataService)
  pages/*.jsx        → Views (equivalente ao antigo views.js)
  App.jsx + Router   → Controller/Navegação (equivalente ao antigo app.js)
```

### Repository Pattern (backend)
```javascript
const docentes = docenteRepo.getAll();
const docente = docenteRepo.getById('id');
const results = docenteRepo.search('termo');
```

### API Client (frontend)
```javascript
const docentes = await api.getDocentes();
const docente = await api.getDocente('id');
```

## 🛠️ Tecnologias

- **React 18** + **React Router 6** — SPA, componentes, navegação
- **Vite** — build tool e dev server do frontend
- **Node.js 18+** + **Express** — API REST
- **CSS3** — Variables, Grid, Flexbox, animações (inalterado)

## 📝 Notas de Desenvolvimento

### Para adicionar uma nova página:
1. Criar componente em `client/src/pages/NovaPagina.jsx`
2. Adicionar `<Route>` em `client/src/App.jsx`
3. Adicionar navegação (`useNavigate()` ou `<Link>`) onde for necessário

### Para adicionar um novo cartão na Home:
Editar `client/src/pages/Home.jsx` e adicionar um novo `.card` com `onClick`
para a nova rota.

### Para adicionar uma nova rota na API:
1. Adicionar handler em `server/routes/api.js`
2. Se necessário, adicionar método ao repositório em `server/dataService.js`
3. Adicionar método correspondente em `client/src/services/api.js`

### Para integrar Google Drive:
1. Criar um projeto no Google Cloud Console e ativar a **Google Drive API**.
2. Criar uma **Service Account** e descarregar o ficheiro JSON de credenciais.
3. Configurar as seguintes variáveis de ambiente (no `.env` ou sistema):
   - `GOOGLE_APPLICATION_CREDENTIALS`: Caminho para o ficheiro JSON.
   - OU `GOOGLE_CLIENT_EMAIL` e `GOOGLE_PRIVATE_KEY` (útil para Heroku/Vercel).
4. O sistema usa os IDs das folhas de cálculo configurados em `server/driveApi.js`.
5. Ao clicar em "Sincronizar" na Home, os dados são descarregados, processados e o cache local é atualizado.

---

**Campus Tech Academy** © 2026
