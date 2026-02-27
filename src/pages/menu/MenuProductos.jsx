import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageModule from '../../components/PageModule/PageModule'
import { Image as ImageIcon } from 'lucide-react'
import { useMenu } from './MenuContext'
import { getProductsAllUseCase, updateProductVisibilityUseCase } from '../../feature/masters/products/use-case'
import { getCategoriesAllUseCase } from '../../feature/masters/category/use-case'
import './MenuProductos.css'

export default function MenuProductos() {
  const { refreshProductos } = useMenu()
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [updatingId, setUpdatingId] = useState(null)
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarTodo = useCallback(() => {
    setError(null)
    setLoading(true)
    const promesas = [
      getCategoriesAllUseCase()
        .then((list) => {
          setCategorias(
            (Array.isArray(list) ? list : [])
              .filter((c) => c.visibility !== false)
              .map((c, i) => ({
                id: c.id,
                nombre: c.name ?? c.nombre ?? '',
                orden: i,
              }))
          )
        })
        .catch((err) => {
          const msg = err?.message ?? err?.toString?.() ?? 'Error al cargar las categorías.'
          setError((e) => e || msg)
          setCategorias([])
        }),
      getProductsAllUseCase()
        .then((list) => {
          setProductos(
            (Array.isArray(list) ? list : []).map((p) => ({
              id: p.id,
              categoriaId: p.category_id ?? p.categoriaId,
              nombre: p.name ?? p.nombre ?? '',
              descripcion: p.description ?? p.descripcion ?? '',
              precio: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
              imagen: p.image_url ?? p.imagen ?? '',
              visibility: p.visibility !== false,
            }))
          )
        })
        .catch((err) => {
          const msg = err?.message ?? err?.toString?.() ?? 'Error al cargar los productos.'
          setError((e) => e || msg)
          setProductos([])
        }),
    ]
    Promise.allSettled(promesas).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    cargarTodo()
  }, [cargarTodo])

  const handleToggleVisibility = useCallback(
    async (prod) => {
      const nuevoValor = !prod.visibility
      setUpdatingId(prod.id)
      try {
        const res = await updateProductVisibilityUseCase(prod.id, nuevoValor)
        if (res?.success) {
          setProductos((prev) =>
            prev.map((p) =>
              p.id === prod.id ? { ...p, visibility: res?.data?.visibility ?? nuevoValor } : p
            )
          )
          refreshProductos?.()
        }
      } catch (_) {}
      finally {
        setUpdatingId(null)
      }
    },
    [refreshProductos]
  )

  const productosVisibles = productos.filter((p) => p.visibility === true)
  const productosFiltrados =
    categoriaFiltro === 'todas'
      ? productosVisibles
      : productosVisibles.filter((p) => String(p.categoriaId) === String(categoriaFiltro))

  const getCategoriaNombre = (categoriaId) =>
    categorias.find((c) => String(c.id) === String(categoriaId))?.nombre ?? '—'

  return (
    <PageModule
      title="Productos en el menú"
      description="Elige qué productos se muestran en el menú. Filtra por categoría (definidas en Categoría) y activa los que quieras."
    >
      {error && (
        <div className="menu-productos-error">
          <p className="menu-productos-error-text">{error}</p>
          <button type="button" className="menu-productos-error-btn" onClick={() => cargarTodo()}>
            Reintentar
          </button>
        </div>
      )}

      {loading && (
        <>
          <div className="menu-productos-filtros">
            <span className="menu-productos-skeleton menu-productos-skeleton-label" />
            <span className="menu-productos-skeleton menu-productos-skeleton-select" />
          </div>
          <div className="menu-productos-list" aria-busy="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="menu-producto-card menu-producto-card-skeleton">
                <div className="menu-producto-info">
                  <span className="menu-productos-skeleton menu-productos-skeleton-thumb" />
                  <div>
                    <span className="menu-productos-skeleton menu-productos-skeleton-nombre" />
                    <span className="menu-productos-skeleton menu-productos-skeleton-meta" />
                  </div>
                </div>
                <span className="menu-productos-skeleton menu-productos-skeleton-toggle" />
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && !error && (
        <>
      <div className="menu-productos-filtros">
        <label>
          <span>Filtrar por categoría:</span>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="menu-productos-select"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </label>
        <Link to="/app/menu/categoria" className="menu-productos-link-categoria">
          Gestionar categorías →
        </Link>
      </div>
      <div className="menu-productos-list">
        {categorias.length === 0 ? (
          <p className="menu-productos-vacio">
            No hay categorías visibles. Ve a <Link to="/app/menu/categoria">Categoría</Link> y activa al menos una en el menú.
          </p>
        ) : productosFiltrados.length === 0 ? (
          <p className="menu-productos-vacio">
            {categoriaFiltro === 'todas'
              ? 'No hay productos visibles. Activa productos en Maestros → Productos (visibilidad en menú).'
              : 'No hay productos visibles en esta categoría.'}
          </p>
        ) : (
          productosFiltrados.map((prod) => {
            const enMenu = prod.visibility
            const loading = updatingId === prod.id
            return (
              <div key={prod.id} className={`menu-producto-card ${enMenu ? 'menu-producto-card-activa' : ''}`}>
                <div className="menu-producto-info">
                  {prod.imagen ? (
                    <img src={prod.imagen} alt="" className="menu-producto-thumb" />
                  ) : (
                    <span className="menu-producto-thumb-sin">
                      <ImageIcon size={24} />
                    </span>
                  )}
                  <div>
                    <span className="menu-producto-nombre">{prod.nombre}</span>
                    <span className="menu-producto-meta">
                      {getCategoriaNombre(prod.categoriaId)} · ${Number(prod.precio).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
                <label className="menu-categoria-toggle">
                  <input
                    type="checkbox"
                    checked={enMenu}
                    disabled={loading}
                    onChange={() => handleToggleVisibility(prod)}
                    aria-label={`${enMenu ? 'Quitar' : 'Incluir'} ${prod.nombre} en el menú`}
                  />
                  <span className="menu-categoria-switch" />
                </label>
              </div>
            )
          })
        )}
      </div>
      <p className="menu-categoria-hint">
        Las categorías se definen en <Link to="/app/menu/categoria">Categoría</Link>. Los productos en <strong>Maestros → Productos</strong>; solo los visibles aparecen aquí. Aquí activas o ocultas cada uno en el menú.
      </p>
        </>
      )}
    </PageModule>
  )
}
