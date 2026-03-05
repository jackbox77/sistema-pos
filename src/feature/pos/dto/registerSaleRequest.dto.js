/**
 * DTO de envío para registrar venta (POST /sales/register)
 */

/**
 * Item de la venta (línea)
 * @typedef {Object} RegisterSaleItemDto
 * @property {string} product_id
 * @property {number} quantity
 * @property {number} unit_price
 * @property {number} tax_amount
 */

/**
 * Pago (método + monto)
 * @typedef {Object} RegisterSalePaymentDto
 * @property {string} payment_method_id
 * @property {number} amount
 */

/**
 * Body para registrar venta
 * @typedef {Object} RegisterSaleRequestDto
 * @property {string} shift_id
 * @property {string} [loyal_customer_id] - Opcional
 * @property {string} [payment_method_id] - Método principal (compatibilidad)
 * @property {RegisterSalePaymentDto[]} [payments] - Métodos de pago con montos
 * @property {RegisterSaleItemDto[]} items
 */
