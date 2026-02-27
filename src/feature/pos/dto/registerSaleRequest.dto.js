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
 * Body para registrar venta
 * @typedef {Object} RegisterSaleRequestDto
 * @property {string} shift_id
 * @property {string} [loyal_customer_id] - Opcional
 * @property {RegisterSaleItemDto[]} items
 */
