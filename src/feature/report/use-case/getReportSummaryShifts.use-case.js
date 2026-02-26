import { getReportSummaryShifts } from '../service'

/**
 * Caso de uso: obtener reporte resumen de turnos (GET /reports/summary/shifts?months=N)
 * @param {number} [months=1] - Últimos N meses
 * @returns {Promise<import('../dto/reportSummaryShiftsResponse.dto').ReportSummaryShiftsResponseDto>}
 */
export async function getReportSummaryShiftsUseCase(months = 1) {
  return getReportSummaryShifts(months)
}
