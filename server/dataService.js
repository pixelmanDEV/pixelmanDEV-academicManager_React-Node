/**
 * ============================================
 * Campus Tech Academy — Data Layer (server)
 * ============================================
 *
 * Responsabilidade: Carregar, cache e fornecer dados.
 * Atualmente: JSON local (fase 1)
 * Futuro: Google Drive API, Firebase, REST API externa
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

class DataService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Carrega dados de um ficheiro JSON
   * @param {string} resource - nome do recurso (docentes, turmas, horarios)
   * @returns {Object|Array}
   */
  load(resource) {
    if (this.cache.has(resource)) {
      return this.cache.get(resource);
    }

    const filePath = path.join(DATA_DIR, `${resource}.json`);

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      this.cache.set(resource, data);
      return data;
    } catch (error) {
      console.error(`[DataService] Erro ao carregar ${resource}:`, error.message);
      return resource === 'horarios' ? [] : {};
    }
  }

  /** Limpa cache */
  clearCache() {
    this.cache.clear();
  }

  /** Invalida um recurso específico */
  invalidate(resource) {
    this.cache.delete(resource);
  }
}

// Singleton
const dataService = new DataService();

/**
 * ============================================
 * MODELS — Estrutura de dados da aplicação
 * ============================================
 */

class Docente {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email || '';
    this.telefone = data.telefone || '';
    this.turmas = data.turmas || [];
    this.modulos = data.modulos || [];
    this.horarios = data.horarios || [];
    this.horarios_count = this.horarios.length;
  }

  getTurmasFormatadas() {
    return this.turmas.map(t => t.replace('CET_TSI_ONL_', 'TSI0'));
  }
}

class Turma {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.nome_completo = data.nome_completo;
    this.docentes = data.docentes || [];
    this.modulos = data.modulos || [];
    this.aulas_count = data.aulas_count || 0;
  }
}

class Horario {
  constructor(data) {
    this.docente = data.docente;
    this.turma = data.turma;
    this.data = data.data;
    this.dia = data.dia;
    this.inicio = data.inicio;
    this.fim = data.fim;
    this.modulo = data.modulo;
    this.obs = data.obs || '';
  }
}

/**
 * ============================================
 * REPOSITORIES — Abstração de acesso a dados
 * ============================================
 */

class DocenteRepository {
  getAll() {
    const data = dataService.load('docentes');
    return Object.values(data).map(d => new Docente(d));
  }

  getById(id) {
    const data = dataService.load('docentes');
    return data[id] ? new Docente(data[id]) : null;
  }

  getByTurma(turmaId) {
    return this.getAll().filter(d => d.turmas.includes(turmaId));
  }

  search(term) {
    const lower = term.toLowerCase();
    return this.getAll().filter(d =>
      d.nome.toLowerCase().includes(lower) ||
      d.email.toLowerCase().includes(lower) ||
      d.turmas.some(t => t.toLowerCase().includes(lower)) ||
      d.modulos.some(m => m.toLowerCase().includes(lower))
    );
  }
}

class TurmaRepository {
  getAll() {
    const data = dataService.load('turmas');
    return Object.values(data).map(t => new Turma(t));
  }

  getById(id) {
    const data = dataService.load('turmas');
    return data[id] ? new Turma(data[id]) : null;
  }
}

class HorarioRepository {
  getByDocente(docenteId) {
    const data = dataService.load('horarios');
    return data.filter(h => h.docente === docenteId).map(h => new Horario(h));
  }

  getByTurma(turmaId) {
    const data = dataService.load('horarios');
    return data.filter(h => h.turma === turmaId).map(h => new Horario(h));
  }
}

module.exports = {
  dataService,
  Docente,
  Turma,
  Horario,
  DocenteRepository,
  TurmaRepository,
  HorarioRepository,
};
