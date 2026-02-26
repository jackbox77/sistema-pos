import { getReportSummaryByInterval } from '../service'

/**
 * Caso de uso: resumen del período entre dos turnos (GET /reports/summary?shift_id_from=...&shift_id_to=...)
 * @param {string} shift_id_from - UUID del turno inicial
 * @param {string} shift_id_to - UUID del turno final
 * @returns {Promise<import('../dto/reportSummaryResponse.dto').ReportSummaryResponseDto>}
 */
export async function getReportSummaryByIntervalUseCase(shift_id_from, shift_id_to) {
  return getReportSummaryByInterval(shift_id_from, shift_id_to)
}
