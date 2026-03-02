import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { getProfileUseCase, getContactUseCase } from '../../feature/menu-config'
import { getCategoriesAllUseCase } from '../../feature/masters/category/use-case'
import { getProductsAllUseCase } from '../../feature/masters/products/use-case'

const aparienciaInicial = {
  colorFondo: '#f8f9fa',
  colorContenido: '#ffffff',
  colorTexto: '#4a5568',
  colorTitulo: '#1a202c',
  colorSubtitulo: '#718096',
  colorPrecio: '#2d3748',
  colorAcento: '#C7D02C',
  colorIconoContacto: '#C7D02C',
  colorTextoContacto: '#ffffff',
  colorFondoContacto: '#134e4a',
  imagenFondo: '',
  imagenHeaderFondo: '',
}

/** Tipos de encabezado del menú */
export const TIPOS_HEADER = [
  { id: 'clasico', label: 'Clásico (logo centrado)' },
  { id: 'imagen-fondo', label: 'Imagen de fondo' },
  { id: 'minimalista', label: 'Minimalista (solo tipografía)' },
  { id: 'editorial', label: 'Editorial (acento lateral)' },
]

const empresaInfoInicial = {
  logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop',
  nombreEmpresa: 'La Terraza',
  subtitulo: 'Cocina casera y tradicional',
  tipoNegocio: 'Restaurante',
  descripcion: 'Sabores auténticos en cada plato. Un lugar acogedor para compartir en familia.',

  // Datos de contacto y horario
  abierto: true, // Si se usa aún para "Estado de negocio" manual
  whatsapp_contact: '',
  visibility_whatsapp_contact: true,
  mail_contact: '',
  visibility_mail_contact: true,
  phone_contact: '',
  visibility_phone_contact: false,
  location: '',
  visibility_location: true,
  schedule_visibility: true,
  schedule: Array.from({ length: 7 }).map((_, day) => ({ day, slots: [{ from: '08:00', to: '20:00' }] })),
}

/** Tipos de menú disponibles */
export const TIPOS_MENU = [
  { id: 'clasico', label: 'Clásico (secciones)' },
  { id: 'tarjetas-categorias', label: 'Tarjetas con barra de categorías' },
  { id: 'categorias-primero', label: 'Categorías primero (estilo Precompro)' },
  { id: 'platos-horizontal', label: 'Platos en horizontal' },
]

/** Mapea header_type del API al id del contexto */
const API_HEADER_TO_CONTEXT = {
  classic: 'clasico',
  background_photo: 'imagen-fondo',
  minimalist: 'minimalista',
  editorial: 'editorial',
}
const CONTEXT_HEADER_TO_API = Object.fromEntries(
  Object.entries(API_HEADER_TO_CONTEXT).map(([k, v]) => [v, k])
)

/** Mapea menu_type del API al id del contexto */
const API_MENU_TO_CONTEXT = {
  classic: 'clasico',
  targets_with_category: 'tarjetas-categorias',
  primary_category: 'categorias-primero',
  horizontal_bowls: 'platos-horizontal',
}
const CONTEXT_MENU_TO_API = Object.fromEntries(
  Object.entries(API_MENU_TO_CONTEXT).map(([k, v]) => [v, k])
)

const MenuContext = createContext(null)

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu debe usarse dentro de MenuLayout')
  return ctx
}

export { CONTEXT_HEADER_TO_API, CONTEXT_MENU_TO_API }

export default function MenuProvider({ children }) {
  const [categoriasAll, setCategoriasAll] = useState([])
  const [productosAll, setProductosAll] = useState([])

  const refreshCategorias = useCallback(() => {
    getCategoriesAllUseCase()
      .then((list) => setCategoriasAll(Array.isArray(list) ? list : []))
      .catch(() => setCategoriasAll([]))
  }, [])

  const refreshProductos = useCallback(() => {
    getProductsAllUseCase()
      .then((list) => setProductosAll(Array.isArray(list) ? list : []))
      .catch(() => setProductosAll([]))
  }, [])

  useEffect(() => {
    refreshCategorias()
  }, [refreshCategorias])

  useEffect(() => {
    refreshProductos()
  }, [refreshProductos])

  /** Categorías disponibles (solo visibles): desde GET categories all, filtradas por visibility del maestro */
  const categoriasDisponibles = useMemo(
    () =>
      categoriasAll
        .filter((c) => c.visibility !== false)
        .map((c, i) => ({
          id: c.id,
          nombre: c.name ?? c.nombre ?? '',
          orden: i,
        })),
    [categoriasAll]
  )

  /** Productos disponibles (solo visibles): desde GET products all, filtrados por visibility del maestro */
  const productosDisponibles = useMemo(
    () =>
      productosAll
        .filter((p) => p.visibility !== false)
        .map((p) => ({
          id: p.id,
          categoriaId: p.category_id ?? p.categoriaId,
          nombre: p.name ?? p.nombre ?? '',
          descripcion: p.description ?? p.descripcion ?? '',
          precio: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
          imagen: p.image_url ?? p.imagen ?? '',
        })),
    [productosAll]
  )

  /** IDs de categorías visibles = "en el menú" (misma lógica que en MenuCategoria) */
  const categoriasEnMenu = useMemo(
    () => categoriasAll.filter((c) => c.visibility !== false).map((c) => c.id),
    [categoriasAll]
  )

  /** IDs de productos visibles = "en el menú" (misma lógica que en MenuProductos) */
  const productosEnMenu = useMemo(
    () => productosAll.filter((p) => p.visibility !== false).map((p) => p.id),
    [productosAll]
  )
  const [apariencia, setApariencia] = useState(aparienciaInicial)
  const [empresaInfo, setEmpresaInfo] = useState(empresaInfoInicial)
  const [tipoMenu, setTipoMenu] = useState('tarjetas-categorias')
  const [mostrarImagenes, setMostrarImagenes] = useState(true)
  const [mostrarVerMas, setMostrarVerMas] = useState(true)
  const [tipoHeader, setTipoHeader] = useState('clasico')
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)

  const loadProfile = useCallback(async () => {
    setProfileError(null)
    setProfileLoading(true)
    try {
      // Cargar perfil (company + menu_config) y contacto en paralelo
      const [res, contactRes] = await Promise.all([
        getProfileUseCase(),
        getContactUseCase().catch(() => null),
      ])

      if (res?.success && res?.data) {
        const { company, menu_config } = res.data
        if (company) {
          setEmpresaInfo((prev) => ({
            ...prev,
            logoUrl: company.logo ?? prev.logoUrl,
            nombreEmpresa: company.name ?? prev.nombreEmpresa,
            subtitulo: company.subtitle ?? prev.subtitulo,
            tipoNegocio: company.business_type ?? prev.tipoNegocio,
            descripcion: company.description ?? prev.descripcion,
          }))
        }
        if (menu_config) {
          setApariencia((prev) => ({
            ...prev,
            colorFondo: menu_config.menu_background_color ?? prev.colorFondo,
            colorContenido: menu_config.content_background_color ?? prev.colorContenido,
            colorTexto: menu_config.text_color ?? prev.colorTexto,
            colorTitulo: menu_config.title_color ?? prev.colorTitulo,
            colorSubtitulo: menu_config.subtitle_color ?? prev.colorSubtitulo,
            colorPrecio: menu_config.price_color ?? prev.colorPrecio,
            colorAcento: menu_config.accent_color ?? prev.colorAcento,
            colorIconoContacto: menu_config.contact_icon_color ?? prev.colorIconoContacto,
            colorTextoContacto: menu_config.contact_text_color ?? prev.colorTextoContacto,
            colorFondoContacto: menu_config.contact_background_color ?? prev.colorFondoContacto,
          }))
          setTipoHeader(API_HEADER_TO_CONTEXT[menu_config.header_type] ?? 'clasico')
          setTipoMenu(API_MENU_TO_CONTEXT[menu_config.menu_type] ?? 'tarjetas-categorias')
          setMostrarImagenes(menu_config.visualization === 'image')
          setMostrarVerMas(menu_config.view_more === 'yes')
        }
      }

      // Mapear datos de contacto al estado de empresaInfo
      if (contactRes?.success && contactRes?.data) {
        const c = contactRes.data
        setEmpresaInfo((prev) => ({
          ...prev,
          whatsapp_contact: c.whatsapp_contact ?? prev.whatsapp_contact,
          visibility_whatsapp_contact: c.visibility_whatsapp_contact ?? prev.visibility_whatsapp_contact,
          mail_contact: c.mail_contact ?? prev.mail_contact,
          visibility_mail_contact: c.visibility_mail_contact ?? prev.visibility_mail_contact,
          phone_contact: c.phone_contact ?? prev.phone_contact,
          visibility_phone_contact: c.visibility_phone_contact ?? prev.visibility_phone_contact,
          location: c.location ?? prev.location,
          visibility_location: c.visibility_location ?? prev.visibility_location,
          schedule_visibility: c.schedule_visibility ?? prev.schedule_visibility,
          schedule: Array.isArray(c.schedule) ? c.schedule : prev.schedule,
        }))
      }
    } catch (err) {
      setProfileError(err?.message ?? 'Error al cargar perfil del menú')
    } finally {
      setProfileLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  /** La visibilidad se gestiona en MenuCategoria/MenuProductos con el API; el contexto refleja los datos cargados. */
  const toggleCategoriaEnMenu = useCallback(() => { }, [])
  const toggleProductoEnMenu = useCallback(() => { }, [])

  /** Categorías seleccionadas para el menú, con sus productos */
  const categoriasConProductos = useMemo(
    () =>
      categoriasDisponibles
        .filter((c) => categoriasEnMenu.includes(c.id))
        .map((cat) => ({
          ...cat,
          items: productosDisponibles.filter(
            (p) => p.categoriaId === cat.id && productosEnMenu.includes(p.id)
          ),
        })),
    [categoriasDisponibles, productosDisponibles, categoriasEnMenu, productosEnMenu]
  )

  const value = {
    categoriasDisponibles,
    productosDisponibles,
    categoriasEnMenu,
    productosEnMenu,
    apariencia,
    setApariencia,
    empresaInfo,
    setEmpresaInfo,
    tipoMenu,
    setTipoMenu,
    mostrarImagenes,
    setMostrarImagenes,
    mostrarVerMas,
    setMostrarVerMas,
    tipoHeader,
    setTipoHeader,
    toggleCategoriaEnMenu,
    toggleProductoEnMenu,
    categoriasConProductos,
    loadProfile,
    profileLoading,
    profileError,
    refreshCategorias,
    refreshProductos,
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
