import { createContext, useContext, useState, useMemo } from 'react'
import { useMaestros } from '../../context/MaestrosContext'

const aparienciaInicial = {
  colorFondo: '#f8f9fa',
  colorContenido: '#ffffff',
  colorTexto: '#4a5568',
  colorTitulo: '#1a202c',
  imagenFondo: '',
}

const empresaInfoInicial = {
  logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop',
  nombreEmpresa: 'La Terraza',
  subtitulo: 'Cocina casera y tradicional',
  tipoNegocio: 'Restaurante',
  descripcion: 'Sabores auténticos en cada plato. Un lugar acogedor para compartir en familia.',
}

/** Tipos de menú disponibles */
export const TIPOS_MENU = [
  { id: 'clasico', label: 'Clásico (secciones)' },
  { id: 'tarjetas-categorias', label: 'Tarjetas con barra de categorías' },
  { id: 'categorias-primero', label: 'Categorías primero (estilo Precompro)' },
  { id: 'platos-horizontal', label: 'Platos en horizontal' },
]

const MenuContext = createContext(null)

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu debe usarse dentro de MenuLayout')
  return ctx
}

export default function MenuProvider({ children }) {
  const { categorias: categoriasMaestro, productos: productosMaestro } = useMaestros()

  /** Categorías disponibles desde el maestro Categorías */
  const categoriasDisponibles = useMemo(
    () => categoriasMaestro.map((c, i) => ({ id: c.id, nombre: c.nombre, orden: i })),
    [categoriasMaestro]
  )

  /** Productos disponibles desde el maestro Productos (relacionados por categoriaId) */
  const productosDisponibles = useMemo(
    () =>
      productosMaestro.map((p) => ({
        id: p.id,
        categoriaId: p.categoriaId,
        nombre: p.nombre,
        descripcion: p.descripcion ?? '',
        precio: typeof p.precio === 'number' ? p.precio : Number(p.precio) || 0,
        imagen: p.imagen ?? '',
      })),
    [productosMaestro]
  )

  const [categoriasEnMenu, setCategoriasEnMenu] = useState([1, 2, 3, 4])
  const [productosEnMenu, setProductosEnMenu] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  const [apariencia, setApariencia] = useState(aparienciaInicial)
  const [empresaInfo, setEmpresaInfo] = useState(empresaInfoInicial)
  const [tipoMenu, setTipoMenu] = useState('tarjetas-categorias')

  const toggleCategoriaEnMenu = (id) => {
    setCategoriasEnMenu((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].sort((a, b) => a - b)
    )
  }

  const toggleProductoEnMenu = (id) => {
    setProductosEnMenu((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

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
    toggleCategoriaEnMenu,
    toggleProductoEnMenu,
    categoriasConProductos,
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
