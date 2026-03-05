import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageModule from '../../components/PageModule/PageModule'
import MenuImage from './MenuImage'
import { useMenu } from './MenuContext'
import { getCategoriesAllUseCase, updateCategoryVisibilityUseCase } from '../../feature/masters/category/use-case'
import './MenuCategoria.css'

export default function MenuCategoria() {
  const { refreshCategorias } = useMenu()
  const [categorias, setCategorias] = useState([])
  const [updatingId, setUpdatingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarCategorias = useCallback(() => {
    setError(null)
    setLoading(true)
    getCategoriesAllUseCase()
      .then((list) => {
        setCategorias(
          (Array.isArray(list) ? list : []).map((c, i) => ({
            id: c.id,
            nombre: c.name ?? c.nombre ?? '',
            orden: i,
            visibility: c.visibility !== false,
            imagen: c.image_url ?? c.imagen ?? '',
          }))
        )
      })
      .catch((err) => {
        const msg = err?.message ?? err?.toString?.() ?? 'Error al cargar las categorías.'
        setError(msg)
        setCategorias([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    cargarCategorias()
  }, [cargarCategorias])

  const handleToggleVisibility = useCallback(
    async (cat) => {
      const nuevoValor = !cat.visibility
      setUpdatingId(cat.id)
      try {
        const res = await updateCategoryVisibilityUseCase(cat.id, nuevoValor)
        if (res?.success) {
          setCategorias((prev) =>
            prev.map((c) => (c.id === cat.id ? { ...c, visibility: res?.data?.visibility ?? nuevoValor } : c))
          )
          refreshCategorias?.()
        }
      } catch (_) {}
      finally {
        setUpdatingId(null)
      }
    },
    [refreshCategorias]
  )

  return (
    <PageModule
      title="Categorías en el menú"
      description="Elige qué categorías del maestro Categorías se muestran en el menú. Las que actives aquí aparecerán en el editor y en la vista previa."
      fullWidth
    >
      {error && (
        <div className="menu-categoria-error">
          <p className="menu-categoria-error-text">{error}</p>
          <button type="button" className="menu-categoria-error-btn" onClick={() => cargarCategorias()}>
            Reintentar
          </button>
        </div>
      )}

      {loading && (
        <div className="menu-categoria-list" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="menu-categoria-card menu-categoria-card-skeleton">
              <div className="menu-categoria-info">
                <span className="menu-categoria-skeleton menu-categoria-skeleton-nombre" />
                <span className="menu-categoria-skeleton menu-categoria-skeleton-badge" />
              </div>
              <span className="menu-categoria-skeleton menu-categoria-skeleton-toggle" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="menu-categoria-list">
          {categorias.map((cat) => {
            const enMenu = cat.visibility
            const loadingCard = updatingId === cat.id
            return (
              <div key={cat.id} className={`menu-categoria-card ${enMenu ? 'menu-categoria-card-activa' : ''}`}>
                <div className="menu-categoria-info">
                  <div className="menu-categoria-thumb-wrap">
                    <MenuImage
                      src={cat.imagen}
                      className="menu-categoria-thumb"
                      wrapperClassName="menu-categoria-thumb-sin"
                      iconSize={28}
                    />
                  </div>
                  <div>
                    <span className="menu-categoria-nombre">{cat.nombre}</span>
                    <span className="menu-categoria-badge">{enMenu ? 'En el menú' : 'Oculta'}</span>
                  </div>
                </div>
                <label className="menu-categoria-toggle">
                  <input
                    type="checkbox"
                    checked={enMenu}
                    disabled={loadingCard}
                    onChange={() => handleToggleVisibility(cat)}
                    aria-label={`${enMenu ? 'Quitar' : 'Incluir'} ${cat.nombre} en el menú`}
                  />
                  <span className="menu-categoria-switch" />
                </label>
              </div>
            )
          })}
        </div>
      )}

      {!loading && !error && (
      <p className="menu-categoria-hint">
        Las categorías se gestionan en <strong>Maestros → Categorías</strong>. Aquí defines cuáles se reflejan en el menú. Luego en <Link to="/app/menu/productos">Productos</Link> eliges qué productos de cada categoría mostrar.
      </p>
      )}
    </PageModule>
  )
}
