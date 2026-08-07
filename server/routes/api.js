const express = require('express');
const {
  DocenteRepository,
  TurmaRepository,
  HorarioRepository,
  dataService,
} = require('../dataService');
const driveApi = require('../driveApi');

const router = express.Router();

const docenteRepo = new DocenteRepository();
const turmaRepo = new TurmaRepository();
const horarioRepo = new HorarioRepository();

// Helper: serializa Docente incluindo campos calculados usados no frontend
function serializeDocente(docente) {
  return {
    ...docente,
    turmasFormatadas: docente.getTurmasFormatadas(),
  };
}

// ===== DOCENTES =====

// GET /api/docentes?search=termo
router.get('/docentes', (req, res) => {
  const { search } = req.query;
  const docentes = search ? docenteRepo.search(search) : docenteRepo.getAll();
  res.json(docentes.map(serializeDocente));
});

// GET /api/docentes/:id
router.get('/docentes/:id', (req, res) => {
  const docente = docenteRepo.getById(req.params.id);
  if (!docente) {
    return res.status(404).json({ error: 'Docente não encontrado' });
  }
  res.json(serializeDocente(docente));
});

// POST /api/docentes
router.post('/docentes', (req, res) => {
  const newDocente = docenteRepo.create(req.body);
  res.status(201).json(serializeDocente(newDocente));
});

// PUT /api/docentes/:id
router.put('/docentes/:id', (req, res) => {
  const updatedDocente = docenteRepo.update(req.params.id, req.body);
  if (!updatedDocente) {
    return res.status(404).json({ error: 'Docente não encontrado' });
  }
  res.json(serializeDocente(updatedDocente));
});

// DELETE /api/docentes/:id
router.delete('/docentes/:id', (req, res) => {
  const success = docenteRepo.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Docente não encontrado' });
  }
  res.status(204).send();
});

// ===== TURMAS =====

// GET /api/turmas
router.get('/turmas', (req, res) => {
  const turmas = turmaRepo.getAll();
  res.json(turmas);
});

// GET /api/turmas/:id
router.get('/turmas/:id', (req, res) => {
  const turma = turmaRepo.getById(req.params.id);
  if (!turma) {
    return res.status(404).json({ error: 'Turma não encontrada' });
  }

  // Inclui um mapa simplificado de docentes da turma (para a página de detalhe)
  const docentesMap = {};
  turma.docentes.forEach((docId) => {
    const doc = docenteRepo.getById(docId);
    if (doc) {
      docentesMap[docId] = {
        email: doc.email,
        modulos: doc.modulos,
      };
    }
  });

  res.json({ ...turma, docentesData: docentesMap });
});

// POST /api/turmas
router.post('/turmas', (req, res) => {
  const newTurma = turmaRepo.create(req.body);
  res.status(201).json(newTurma);
});

// PUT /api/turmas/:id
router.put('/turmas/:id', (req, res) => {
  const updatedTurma = turmaRepo.update(req.params.id, req.body);
  if (!updatedTurma) {
    return res.status(404).json({ error: 'Turma não encontrada' });
  }
  res.json(updatedTurma);
});

// DELETE /api/turmas/:id
router.delete('/turmas/:id', (req, res) => {
  const success = turmaRepo.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Turma não encontrada' });
  }
  res.status(204).send();
});

// ===== HORARIOS =====

// GET /api/horarios?docente=ID  ou  /api/horarios?turma=ID
router.get('/horarios', (req, res) => {
  const { docente, turma } = req.query;

  if (docente) {
    return res.json(horarioRepo.getByDocente(docente));
  }
  if (turma) {
    return res.json(horarioRepo.getByTurma(turma));
  }

  res.status(400).json({ error: 'Indique o parâmetro "docente" ou "turma"' });
});

// ===== SYNC =====

// GET /api/drive-status
router.get('/drive-status', async (req, res) => {
  const isConfigured = !!(
    (process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
    (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
  );
  res.json({ 
    configured: isConfigured,
    files: driveApi.FILES
  });
});

// POST /api/sync
router.post('/sync', async (req, res) => {
  try {
    const result = await driveApi.sync();
    if (result.success) {
      dataService.clearCache(); // Invalida cache local para carregar novos dados
      res.json({ message: 'Sincronização concluída com sucesso', data: result.data });
    } else {
      res.status(500).json({ error: result.message || 'Erro na sincronização' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
