/**
 * Helpers para consumir respuestas del módulo de reportes (summary / summary/shifts).
 * Permite que la UI trate ambas respuestas con la misma lógica de "entradas por turno".
 */

/**
 * Extrae data de la respuesta de un use case de reporte (summary o summary/shifts).
 * @param {import('./dto/reportSummaryResponse.dto').ReportSummaryResponseDto|import('./dto/reportSummaryShiftsResponse.dto').ReportSummaryShiftsResponseDto} response
 * @returns {import('./dto/reportSummaryResponse.dto').ReportSummaryDataDto|import('./dto/reportSummaryShiftsResponse.dto').ReportSummaryShiftsDataDto|null}
 */
export function getReportSummaryData(response) {
  return response?.data ?? null
}

/**
 * Indica si data corresponde a GET /reports/summary (un turno o intervalo), no a summary/shifts (meses).
 * En summary: data tiene shifts_count, total_ingresos, total_egresos, total_ventas, sales_count.
 * @param {Object} data - data extraída de la respuesta
 * @returns {boolean}
 */
export function isSummaryByShift(data) {
  return Boolean(data && typeof data.shifts_count === 'number')
}

/**
 * Devuelve entradas normalizadas para mostrar "por turno" (shift + totales).
 * Válido para ambos: summary (shift_id o interval) y summary/shifts (months).
 * @param {Object} data - data con propiedad shifts (array)
 * @returns {{ shift: Object, total_ingresos: number, total_egresos: number, total_ventas: number }[]}
 */
export function getSummaryEntries(data) {
  const shifts = data?.shifts ?? []
  return shifts.map((e) =>
    e?.shift
      ? {
          shift: e.shift,
          total_ingresos: e.total_ingresos ?? 0,
          total_egresos: e.total_egresos ?? 0,
          total_ventas: e.total_ventas ?? 0,
        }
      : {
          shift: e,
          total_ingresos: 0,
          total_egresos: 0,
          total_ventas: 0,
        }
  )
}

/**
 * Formatea un turno para etiqueta en listas (nombre + fecha/hora de inicio).
 * @param {Object} shift - objeto shift con name, start_at
 * @param {string} [locale='es-CO']
 * @returns {string}
 */
export function formatShiftLabel(shift, locale = 'es-CO') {
  if (!shift) return ''
  const start = shift.start_at ? new Date(shift.start_at) : null
  const startStr =
    start && !Number.isNaN(start.getTime())
      ? start.toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })
      : ''
  const name = shift.name ?? 'Turno'
  return startStr ? `${name} (${startStr})` : name
}
