/**
 * DTO de respuesta GET /reports/summary
 * Usado tanto con ?shift_id=... como con ?shift_id_from=...&shift_id_to=...
 *
 * Ejemplo (un turno):
 * {
 *   "success": true,
 *   "message": "Resumen del período",
 *   "data": {
 *     "shifts": [
 *       {
 *         "id": "...",
 *         "company_id": "...",
 *         "name": "Turno 20-Feb",
 *         "start_at": "2025-02-20T08:00:00Z",
 *         "end_at": "2025-02-20T18:30:00Z",
 *         "opened_by_user_id": "...",
 *         "closed_by_user_id": "...",
 *         "created_at": "...",
 *         "updated_at": "..."
 *       }
 *     ],
 *     "shifts_count": 1,
 *     "total_ingresos": 150000,
 *     "total_egresos": 80000,
 *     "total_ventas": 320000,
 *     "sales_count": 45,
 *     "sales": [
 *       {
 *         "id": "...",
 *         "shift_id": "...",
 *         "total": 15000,
 *         "reference": "...",
 *         "created_at": "..."
 *       }
 *     ],
 *     "from": "2025-02-20",
 *     "to": "2025-02-20"
 *   }
 * }
 */

/**
 * Item de turno en data.shifts
 * @typedef {Object} ReportSummaryShiftDto
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
 * Item de venta en data.sales
 * @typedef {Object} ReportSaleDto
 * @property {string} id
 * @property {string} shift_id
 * @property {number} total
 * @property {string} reference
 * @property {string} created_at
 */

/**
 * Datos internos de la respuesta GET /reports/summary
 * @typedef {Object} ReportSummaryDataDto
 * @property {ReportSummaryShiftDto[]} shifts
 * @property {number} shifts_count
 * @property {number} total_ingresos
 * @property {number} total_egresos
 * @property {number} total_ventas
 * @property {number} sales_count
 * @property {ReportSaleDto[]} sales
 * @property {string} from - YYYY-MM-DD
 * @property {string} to - YYYY-MM-DD
 */

/**
 * Respuesta exitosa GET /reports/summary (con shift_id o shift_id_from + shift_id_to)
 * @typedef {Object} ReportSummaryResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ReportSummaryDataDto} data
 */
