# Campus Tech Academy — Plataforma de Gestão Académica

## 📋 Descrição

O **Campus Tech Academy** é uma plataforma de gestão académica moderna construída com **React** (Frontend) e **Node.js/Express** (Backend). A plataforma permite a gestão centralizada de docentes, turmas e horários, utilizando folhas de cálculo do **Google Drive** como fonte de dados dinâmica.

## 🚀 Funcionalidades Atuais

- **Dashboard Inicial**: Visão geral com acesso rápido às principais áreas.
- **Sincronização com Google Drive**: Atualização em tempo real de dados a partir de Excels externos.
- **Gestão de Docentes**: Listagem, pesquisa avançada e perfis detalhados (contactos, turmas, módulos).
- **Gestão de Turmas**: Detalhes da turma, lista de docentes atribuídos e estatísticas de aulas.
- **Horários Dinâmicos**: Visualização de horários por docente ou por turma.

## 🏗️ Arquitetura do Projeto

```
campus-tech-academy/
├── client/                  # Frontend React (Vite)
│   ├── src/
│   │   ├── pages/           # Home, Docentes, Turmas, Detalhes
│   │   ├── components/      # Sidebar, Topbar, Icons, Tabs
│   │   └── services/        # Cliente API (api.js)
│   └── public/assets/       # CSS Global e Imagens
└── server/                   # Backend Node/Express
    ├── dataService.js        # Lógica de acesso a dados e Cache
    ├── driveApi.js           # Integração com Google Drive API
    ├── routes/               # Endpoints REST (/api/...)
    └── data/                 # Armazenamento local (JSON fallbacks)
```

## 🛠️ Instalação e Configuração

### 1. Dependências
```bash
npm run install:all
```

### 2. Configuração do Google Drive
Para ativar a sincronização, é necessário configurar as credenciais na pasta `server/`:
1. Renomeie `.env.example` para `.env`.
2. Adicione os IDs das suas folhas de cálculo no `.env`.
3. Coloque o seu ficheiro `credentials.json` (Service Account) na pasta `server/`.
4. Partilhe os seus Excels com o email da Service Account.

### 3. Execução
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 🔄 Roadmap de Implementação

### ✅ Fase 1 — Core & UI
- [x] Estrutura React + Node funcional.
- [x] Interface de utilizador (UI) completa e responsiva.
- [x] API REST para Docentes, Turmas e Horários.

### ✅ Fase 2 — Integração Google Drive
- [x] Implementação do `DriveAPIService`.
- [x] Lógica de mapeamento e transformação de dados Excel para JSON.
- [x] Botão de sincronização manual na interface.
- [x] Sistema de cache e persistência local.

### ⏳ Fase 3 — Autenticação e Segurança
- [ ] Implementação de Login com Google OAuth.
- [ ] Definição de Roles (Admin vs Docente).
- [ ] Proteção de rotas e permissões de acesso.

### ⏳ Fase 4 — Base de Dados & Funcionalidades Avançadas
- [ ] Migração para Base de Dados persistente (PostgreSQL/Supabase).
- [ ] Registo de presenças e pautas de notas editáveis.
- [ ] Exportação de relatórios em PDF/Excel.

---

**Campus Tech Academy** © 2026
