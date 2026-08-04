/**
 * ============================================
 * Campus Tech Academy — API Client
 * ============================================
 *
 * Substitui o antigo DataService (fetch a ficheiros JSON estáticos)
 * por chamadas à API REST do backend Node/Express.
 * Em desenvolvimento, o Vite faz proxy de /api para http://localhost:3001.
 */

const BASE_URL = '/api';

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ao pedir ${path}`);
  }
  return response.json();
}

export const api = {
  getDocentes: (search = '') =>
    request(`/docentes${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  getDocente: (id) => request(`/docentes/${encodeURIComponent(id)}`),

  getTurmas: () => request('/turmas'),

  getTurma: (id) => request(`/turmas/${encodeURIComponent(id)}`),

  getHorariosByDocente: (docenteId) =>
    request(`/horarios?docente=${encodeURIComponent(docenteId)}`),

  getHorariosByTurma: (turmaId) =>
    request(`/horarios?turma=${encodeURIComponent(turmaId)}`),

  sync: async () => {
    const response = await fetch(`${BASE_URL}/sync`, { method: 'POST' });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || `HTTP ${response.status} na sincronização`);
    }
    return response.json();
  },
};

/** Formata o nome de uma turma (CET_TSI_ONL_01 -> TSI001) */
export function formatTurma(nomeTurma) {
  return nomeTurma.replace('CET_TSI_ONL_', 'TSI0');
}
