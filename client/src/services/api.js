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

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    if (response.status === 204) return null;
    throw new Error(`HTTP ${response.status} ao pedir ${path}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getDocentes: (search = '') =>
    request(`/docentes${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  getDocente: (id) => request(`/docentes/${encodeURIComponent(id)}`),

  createDocente: (data) =>
    request('/docentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  updateDocente: (id, data) =>
    request(`/docentes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  deleteDocente: (id) =>
    request(`/docentes/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getTurmas: () => request('/turmas'),

  getTurma: (id) => request(`/turmas/${encodeURIComponent(id)}`),

  createTurma: (data) =>
    request('/turmas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  updateTurma: (id, data) =>
    request(`/turmas/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  deleteTurma: (id) =>
    request(`/turmas/${encodeURIComponent(id)}`, { method: 'DELETE' }),

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

  getDriveStatus: () => request('/drive-status'),
};

/** Formata o nome de uma turma (CET_TSI_ONL_01 -> TSI001) */
export function formatTurma(nomeTurma) {
  return nomeTurma.replace('CET_TSI_ONL_', 'TSI0');
}
