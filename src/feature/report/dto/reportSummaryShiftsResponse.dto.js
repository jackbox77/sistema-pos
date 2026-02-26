/**
 * DTO de respuesta GET /reports/summary/shifts?months=N
 *
 * Ejemplo:
 * {
 *   "success": true,
 *   "message": "Turnos en el período",
 *   "data": {
 *     "shifts": [
 *       {
 *         "shift": {
 *           "id": "...",
 *           "company_id": "...",
 *           "name": "Turno 20-Feb",
 *           "start_at": "...",
 *           "end_at": "...",
 *           "opened_by_user_id": "...",
 *           "closed_by_user_id": "...",
 *           "created_at": "...",
 *           "updated_at": "..."
 *         },
 *         "total_ingresos": 150000,
 *         "total_egresos": 80000,
 *         "total_ventas": 320000
 *       }
 *     ],
 *     "sales": [
 *       {
 *         "id": "...",
 *         "shift_id": "...",
 *         "total": 15000,
 *         "reference": "...",
 *         "created_at": "..."
 *       }
 *     ],
 *     "from": "2024-10-20",
 *     "to": "2025-02-20"
 *   }
 * }
 */

/**
 * Turno dentro del item del reporte (misma estructura que shift de la API de turnos)
 * @typedef {Object} ReportShiftItemDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} name
 * @property {string} start_at - ISO 8601
 * @property {string|null} end_at
 * @property {string} opened_by_user_id
 * @property {string|null} closed_by_user_id
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Item del array shifts en data
 * @typedef {Object} ReportSummaryShiftEntryDto
 * @property {ReportShiftItemDto} shift
 * @property {number} total_ingresos
 * @property {number} total_egresos
 * @property {number} total_ventas
 */

/**
 * Item de venta en data.sales
 * @typedef {Object} ReportSaleDto
 * @property {string} id
 * @property {string} shift_id
 * @property {number} total
 * @property {string} reference
 * @property {string} created_at
 */

/**
 * Datos internos de la respuesta
 * @typedef {Object} ReportSummaryShiftsDataDto
 * @property {ReportSummaryShiftEntryDto[]} shifts
 * @property {ReportSaleDto[]} sales
 * @property {string} from - Fecha inicio del período (YYYY-MM-DD)
 * @property {string} to - Fecha fin del período (YYYY-MM-DD)
 */

/**
 * Respuesta exitosa del reporte resumen por turnos
 * @typedef {Object} ReportSummaryShiftsResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ReportSummaryShiftsDataDto} data
 */
