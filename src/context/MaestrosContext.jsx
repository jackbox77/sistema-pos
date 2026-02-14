import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_CATEGORIAS = 'maestros_categorias'
const STORAGE_PRODUCTOS = 'maestros_productos'

const categoriasIniciales = [
  { id: 1, codigo: 'CAT-001', nombre: 'Entradas', descripcion: 'Para comenzar', imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&h=160&fit=crop' },
  { id: 2, codigo: 'CAT-002', nombre: 'Platos fuertes', descripcion: 'Nuestras especialidades', imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=160&h=160&fit=crop' },
  { id: 3, codigo: 'CAT-003', nombre: 'Bebidas', descripcion: 'Refrescos y bebidas', imagen: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=160&h=160&fit=crop' },
  { id: 4, codigo: 'CAT-004', nombre: 'Postres', descripcion: 'Dulces para cerrar', imagen: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=160&h=160&fit=crop' },
]

const productosIniciales = [
  { id: 1, codigo: 'PROD-001', nombre: 'Ensalada César', categoriaId: 1, descripcion: 'Lechuga romana, pollo grillado, parmesano', precio: 18500, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=160&h=160&fit=crop' },
  { id: 2, codigo: 'PROD-002', nombre: 'Bruschetta', categoriaId: 1, descripcion: 'Pan artesanal con tomate y albahaca', precio: 12500, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=160&h=160&fit=crop' },
  { id: 3, codigo: 'PROD-003', nombre: 'Sopa del día', categoriaId: 1, descripcion: 'Según disponibilidad', precio: 9800, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=160&h=160&fit=crop' },
  { id: 4, codigo: 'PROD-004', nombre: 'Bandeja paisa', categoriaId: 2, descripcion: 'Arroz, frijoles, chorizo, chicharrón, huevo', precio: 32000, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=160&h=160&fit=crop' },
  { id: 5, codigo: 'PROD-005', nombre: 'Pechuga a la plancha', categoriaId: 2, descripcion: 'Con vegetales y papas salteadas', precio: 24500, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=160&h=160&fit=crop' },
  { id: 6, codigo: 'PROD-006', nombre: 'Pasta al pesto', categoriaId: 2, descripcion: 'Espagueti con salsa de albahaca y piñones', precio: 19800, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=160&h=160&fit=crop' },
  { id: 7, codigo: 'PROD-007', nombre: 'Limonada natural', categoriaId: 3, descripcion: 'Jugo de limón recién exprimido', precio: 6500, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=160&h=160&fit=crop' },
  { id: 8, codigo: 'PROD-008', nombre: 'Jugo de maracuyá', categoriaId: 3, descripcion: 'Natural con pulpa', precio: 7200, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=160&h=160&fit=crop' },
  { id: 9, codigo: 'PROD-009', nombre: 'Café tinto', categoriaId: 3, descripcion: 'Café colombiano de altura', precio: 4500, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=160&h=160&fit=crop' },
  { id: 10, codigo: 'PROD-010', nombre: 'Brownie con helado', categoriaId: 4, descripcion: 'Brownie de chocolate con helado de vainilla', precio: 12800, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=160&h=160&fit=crop' },
  { id: 11, codigo: 'PROD-011', nombre: 'Tiramisú', categoriaId: 4, descripcion: 'Clásico italiano con café y mascarpone', precio: 15200, impuesto: 'IVA 19%', imagen: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=160&h=160&fit=crop' },
]

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return fallback
}

function saveJson(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (_) {}
}

const MaestrosContext = createContext(null)

export function useMaestros() {
  const ctx = useContext(MaestrosContext)
  if (!ctx) throw new Error('useMaestros debe usarse dentro de MaestrosProvider')
  return ctx
}

export default function MaestrosProvider({ children }) {
  const [categorias, setCategorias] = useState(() => loadJson(STORAGE_CATEGORIAS, categoriasIniciales))
  const [productos, setProductos] = useState(() => loadJson(STORAGE_PRODUCTOS, productosIniciales))

  useEffect(() => {
    saveJson(STORAGE_CATEGORIAS, categorias)
  }, [categorias])

  useEffect(() => {
    saveJson(STORAGE_PRODUCTOS, productos)
  }, [productos])

  const agregarCategoria = useCallback((data) => {
    const id = Math.max(0, ...categorias.map((c) => c.id)) + 1
    setCategorias((prev) => [...prev, { ...data, id, imagen: data.imagen ?? '' }])
  }, [categorias])

  const actualizarCategoria = useCallback((id, data) => {
    setCategorias((prev) =>
      prev.map((c) => (c.id === Number(id) ? { ...c, ...data } : c))
    )
  }, [])

  const eliminarCategoria = useCallback((id) => {
    setCategorias((prev) => prev.filter((c) => c.id !== id))
    setProductos((prev) => prev.filter((p) => p.categoriaId !== id))
  }, [])

  const getCategoria = useCallback((id) => categorias.find((c) => c.id === Number(id)), [categorias])

  const agregarProducto = useCallback((data) => {
    const id = Math.max(0, ...productos.map((p) => p.id)) + 1
    const precio = typeof data.precio === 'string' ? Number(data.precio) || 0 : data.precio
    let categoriaId = data.categoriaId
    if (categoriaId == null && typeof data.categoria === 'string') {
      const cat = categorias.find((c) => c.nombre === data.categoria)
      categoriaId = cat?.id ?? categorias[0]?.id ?? 1
    }
    if (categoriaId == null) categoriaId = 1
    setProductos((prev) => [
      ...prev,
      {
        id,
        codigo: data.codigo ?? '',
        nombre: data.nombre ?? '',
        categoriaId,
        descripcion: data.descripcion ?? '',
        precio,
        impuesto: data.impuesto ?? 'IVA 19%',
        imagen: data.imagen ?? '',
      },
    ])
  }, [productos, categorias])

  const actualizarProducto = useCallback((id, data) => {
    const precio = data.precio !== undefined
      ? (typeof data.precio === 'string' ? Number(data.precio) || 0 : data.precio)
      : undefined
    setProductos((prev) =>
      prev.map((p) => {
        if (p.id !== Number(id)) return p
        const next = { ...p, ...data }
        if (precio !== undefined) next.precio = precio
        if (data.categoriaId !== undefined) next.categoriaId = data.categoriaId
        return next
      })
    )
  }, [])

  const eliminarProducto = useCallback((id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const obtenerProducto = useCallback((id) => productos.find((p) => p.id === Number(id)), [productos])

  const value = {
    categorias,
    setCategorias,
    productos,
    setProductos,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    getCategoria,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProducto,
  }

  return (
    <MaestrosContext.Provider value={value}>
      {children}
    </MaestrosContext.Provider>
  )
}
