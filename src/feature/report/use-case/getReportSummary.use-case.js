import { getReportSummary } from '../service'

/**
 * Caso de uso: obtener resumen del período por turno (GET /reports/summary?shift_id=...)
 * @param {string} shift_id - UUID del turno
 * @returns {Promise<import('../dto/reportSummaryResponse.dto').ReportSummaryResponseDto>}
 */
export async function getReportSummaryUseCase(shift_id) {
  return getReportSummary(shift_id)
}
