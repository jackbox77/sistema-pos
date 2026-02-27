/**
 * DTO de envío PUT /companies/me/profile
 *
 * Body ejemplo:
 * {
 *   "company": { "logo": "...", "business_type": "restaurante" },
 *   "menu_config": {
 *     "header_type": "classic",
 *     "menu_type": "targets_with_category",
 *     "visualization": "image",
 *     "view_more": "yes",
 *     "menu_background_color": "#ffffff",
 *     ...
 *   }
 * }
 *
 * header_type: classic | background_photo | minimalist | editorial
 * menu_type: classic | targets_with_category | primary_category | horizontal_bowls
 * visualization: image | text
 * view_more: yes | no
 */

/**
 * @typedef {Object} UpdateProfileCompanyDto
 * @property {string} [logo]
 * @property {string} [business_type]
 */

/**
 * @typedef {Object} UpdateProfileMenuConfigDto
 * @property {string} [header_type] - classic | background_photo | minimalist | editorial
 * @property {string} [menu_type] - classic | targets_with_category | primary_category | horizontal_bowls
 * @property {string} [visualization] - image | text
 * @property {string} [view_more] - yes | no
 * @property {string} [menu_background_color]
 * @property {string} [content_background_color]
 * @property {string} [text_color]
 * @property {string} [title_color]
 */

/**
 * @typedef {Object} UpdateProfileRequestDto
 * @property {UpdateProfileCompanyDto} [company]
 * @property {UpdateProfileMenuConfigDto} [menu_config]
 */

/**
 * Crea el cuerpo para actualizar perfil (PUT /companies/me/profile)
 * @param {Object} params
 * @param {Object} [params.company] - { logo, business_type }
 * @param {Object} [params.menu_config] - header_type, menu_type, visualization, view_more, colores...
 * @returns {UpdateProfileRequestDto}
 */
export function createUpdateProfileRequest(params = {}) {
  const body = {}
  if (params.company != null) {
    body.company = {
      ...(params.company.logo != null && { logo: params.company.logo }),
      ...(params.company.business_type != null && { business_type: params.company.business_type }),
    }
    if (Object.keys(body.company).length === 0) delete body.company
  }
  if (params.menu_config != null) {
    const mc = params.menu_config
    body.menu_config = {
      ...(mc.header_type != null && { header_type: mc.header_type }),
      ...(mc.menu_type != null && { menu_type: mc.menu_type }),
      ...(mc.visualization != null && { visualization: mc.visualization }),
      ...(mc.view_more != null && { view_more: mc.view_more }),
      ...(mc.menu_background_color != null && { menu_background_color: mc.menu_background_color }),
      ...(mc.content_background_color != null && { content_background_color: mc.content_background_color }),
      ...(mc.text_color != null && { text_color: mc.text_color }),
      ...(mc.title_color != null && { title_color: mc.title_color }),
    }
    if (Object.keys(body.menu_config).length === 0) delete body.menu_config
  }
  return body
}
