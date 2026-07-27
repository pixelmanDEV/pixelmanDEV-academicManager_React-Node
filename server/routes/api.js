const express = require('express');
const {
  DocenteRepository,
  TurmaRepository,
  HorarioRepository,
} = require('../dataService');

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

module.exports = router;
