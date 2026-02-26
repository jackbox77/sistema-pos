import { requestWithToken } from '../../../utils/apiMiddleware'
import { REPORT_API } from '../api-const'

/**
 * Reporte resumen del período por un turno: GET /reports/summary?shift_id=...
 * @param {string} shift_id - UUID del turno
 * @returns {Promise<import('../dto/reportSummaryResponse.dto').ReportSummaryResponseDto>}
 */
export async function getReportSummary(shift_id) {
  const url = REPORT_API.SUMMARY(shift_id)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Reporte resumen del período entre dos turnos: GET /reports/summary?shift_id_from=...&shift_id_to=...
 * @param {string} shift_id_from - UUID del turno inicial
 * @param {string} shift_id_to - UUID del turno final
 * @returns {Promise<import('../dto/reportSummaryResponse.dto').ReportSummaryResponseDto>}
 */
export async function getReportSummaryByInterval(shift_id_from, shift_id_to) {
  const url = REPORT_API.SUMMARY_BY_INTERVAL(shift_id_from, shift_id_to)
  const response = await requestWithToken.get(url)
  return response
}

/**
 * Reporte resumen de turnos: GET /reports/summary/shifts?months=N
 * @param {number} [months=1] - Cantidad de meses del período
 * @returns {Promise<import('../dto/reportSummaryShiftsResponse.dto').ReportSummaryShiftsResponseDto>}
 */
export async function getReportSummaryShifts(months = 1) {
  const url = REPORT_API.SUMMARY_SHIFTS(months)
  const response = await requestWithToken.get(url)
  return response
}
