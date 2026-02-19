/**
 * DTO de respuesta al crear método de pago (POST /payment-methods)
 * {
 *   "success": true,
 *   "message": "Payment method created successfully",
 *   "data": {
 *     "id": "f9fa72e8-5474-4aa0-a3b1-12ef8659d6a8",
 *     "company_id": "9d48445b-3132-4a09-9a54-5c8758ecf139",
 *     "code": "EFECTIVO",
 *     "method_name": "Efectivo",
 *     "description": "Pago en efectivo",
 *     "status": "active",
 *     "created_at": "2026-02-19T01:34:28.621968Z",
 *     "updated_at": "2026-02-19T01:34:28.622996494Z"
 *   }
 * }
 */

/** @typedef {Object} PaymentMethodItemDto
 * @property {string} id
 * @property {string} company_id
 * @property {string} code
 * @property {string} method_name
 * @property {string} [description]
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} PaymentMethodCreateResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {PaymentMethodItemDto} data
 */

/**
 * Respuesta PUT /payment-methods/:id (actualizar)
 * message: "Payment method retrieved successfully" | "Payment method updated successfully"
 * @typedef {Object} PaymentMethodUpdateResponseDto
 * @property {boolean} success
 * @property {string} message
 * @property {PaymentMethodItemDto} data
 */
