/**
 * Constantes de API para menú configuración (perfil con company y menu_config)
 */

const BASE = '/companies'

export const MENU_CONFIG_API = {
  /** GET /companies/me/profile - Perfil (company + menu_config) */
  GET_PROFILE: `${BASE}/me/profile`,
  /** PUT /companies/me/profile - Actualizar perfil (company + menu_config) */
  UPDATE_PROFILE: `${BASE}/me/profile`,
  /** GET /menu-config-contact - Obtener contacto del menú */
  GET_CONTACT: '/menu-config-contact',
  /** PUT /menu-config-contact - Actualizar contacto de menú */
  UPDATE_CONTACT: '/menu-config-contact',
}
