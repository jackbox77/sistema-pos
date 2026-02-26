/**
 * Constantes de API para el módulo de reportes
 */

const BASE = '/reports'

function appendQuery(path, params) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && String(v).trim() !== '') q.set(k, String(v).trim())
  })
  const query = q.toString()
  return query ? `${path}?${query}` : path
}

export const REPORT_API = {
  /** GET /reports/summary?shift_id=... - Resumen del período por un turno */
  SUMMARY: (shift_id) => appendQuery(`${BASE}/summary`, { shift_id }),
  /** GET /reports/summary?shift_id_from=...&shift_id_to=... - Resumen del período entre dos turnos */
  SUMMARY_BY_INTERVAL: (shift_id_from, shift_id_to) =>
    appendQuery(`${BASE}/summary`, { shift_id_from, shift_id_to }),
  /** GET /reports/summary/shifts?months=N - Resumen de turnos en el período (últimos N meses) */
  SUMMARY_SHIFTS: (months) => `${BASE}/summary/shifts?months=${Number(months) || 0}`,
}
