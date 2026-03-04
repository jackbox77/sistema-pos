/**
 * DTO de respuesta GET /reports/summary
 * Misma estructura para:
 *   - GET /reports/summary?shift_id=... (un turno)
 *   - GET /reports/summary?shift_id_from=...&shift_id_to=... (intervalo)
 *
 * Ejemplo (un turno, data.shifts con un solo ítem; shift.end_at puede ser null si está abierto):
 * {
 *   "success": true,
 *   "message": "Resumen por turnos",
 *   "data": {
 *     "shifts": [
 *       {
 *         "shift": {
 *           "id": "...",
 *           "company_id": "...",
 *           "name": "jueves 19 febrero noche",
 *           "start_at": "2026-02-19T20:00:00Z",
 *           "end_at": "2026-02-20T02:00:00Z",
 *           "opened_by_user_id": "...",
 *           "closed_by_user_id": "...",
 *           "created_at": "...",
 *           "updated_at": "..."
 *         },
 *         "total_ingresos": 15000,
 *         "total_egresos": 5000,
 *         "total_ventas": 0,
 *         "sales": []
 *       },
 *       {
 *         "shift": { ... },
 *         "total_ingresos": 0,
 *         "total_egresos": 0,
 *         "total_ventas": 6000,
 *         "sales": [
 *           {
 *             "id": "...",
 *             "company_id": "...",
 *             "shift_id": "...",
 *             "loyal_customer_id": "...",
 *             "total": 6000,
 *             "subtotal": null,
 *             "tax_amount": null,
 *             "reference": null,
 *             "created_at": "...",
 *             "updated_at": "..."
 *           }
 *         ]
 *       }
 *     ],
 *     "shifts_count": 3,
 *     "total_ingresos": 15000,
 *     "total_egresos": 5000,
 *     "total_ventas": 200006000,
 *     "sales_count": 2,
 *     "from": "2026-02-19",
 *     "to": "2026-02-19"
 *   }
 * }
 */

/**
 * Turno dentro del item del reporte (misma estructura que shift de la API de turnos)
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
 * Venta dentro de un turno en data.shifts[].sales
 * @typedef {Object} ReportSummarySaleDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} shift_id
 * @property {string|null} loyal_customer_id
 * @property {number} total
 * @property {number|null} subtotal
 * @property {number|null} tax_amount
 * @property {string|null} reference
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Item del array data.shifts (un turno con sus totales y ventas)
 * @typedef {Object} ReportSummaryShiftEntryDto
 * @property {ReportSummaryShiftDto} shift
 * @property {number} total_ingresos
 * @property {number} total_egresos
 * @property {number} total_ventas
 * @property {ReportSummarySaleDto[]} sales
 */

/**
 * Datos internos de la respuesta GET /reports/summary
 * @typedef {Object} ReportSummaryDataDto
 * @property {ReportSummaryShiftEntryDto[]} shifts
 * @property {number} shifts_count
 * @property {number} total_ingresos
 * @property {number} total_egresos
 * @property {number} total_ventas
 * @property {number} sales_count
 * @property {string} from - YYYY-MM-DD
 * @property {string} to - YYYY-MM-DD
 */

/**
 * Respuesta exitosa GET /reports/summary (shift_id o shift_id_from + shift_id_to)
 * @typedef {Object} ReportSummaryResponseDto
 * @property {true} success
 * @property {string} message
 * @property {ReportSummaryDataDto} data
 */
