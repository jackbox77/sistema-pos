/**
 * DTO de respuesta al registrar venta (POST /sales/register)
 */

/**
 * Venta creada en la respuesta
 * @typedef {Object} RegisterSaleDataSaleDto
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
 * Item de venta en la respuesta
 * @typedef {Object} RegisterSaleDataItemDto
 * @property {string} id
 * @property {string} sale_id
 * @property {string} product_id
 * @property {string} product_name_snapshot
 * @property {number} quantity
 * @property {number} unit_price
 * @property {number} tax_amount
 * @property {number} line_total
 * @property {string} created_at
 */

/**
 * Datos internos de la respuesta (sale + items)
 * @typedef {Object} RegisterSaleDataDto
 * @property {RegisterSaleDataSaleDto} sale
 * @property {RegisterSaleDataItemDto[]} items
 */

/**
 * Respuesta exitosa al registrar venta
 * @typedef {Object} RegisterSaleResponseDto
 * @property {true} success
 * @property {string} message
 * @property {RegisterSaleDataDto} data
 */
