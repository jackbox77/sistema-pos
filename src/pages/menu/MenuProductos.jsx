import PageModule from '../../components/PageModule/PageModule'
import { Image as ImageIcon } from 'lucide-react'
import { useMenu } from './MenuContext'
import './MenuProductos.css'

export default function MenuProductos() {
  const { categoriasDisponibles, productosDisponibles, productosEnMenu, toggleProductoEnMenu } = useMenu()

  const getCategoriaNombre = (categoriaId) =>
    categoriasDisponibles.find((c) => c.id === categoriaId)?.nombre ?? '—'

  return (
    <PageModule
      title="Productos en el menú"
      description="Elige qué productos del maestro Productos se muestran en el menú. Solo se listan los que pertenecen a categorías ya incluidas en el menú."
    >
      <div className="menu-productos-list">
        {productosDisponibles.map((prod) => {
          const enMenu = productosEnMenu.includes(prod.id)
          return (
            <div key={prod.id} className={`menu-producto-card ${enMenu ? 'menu-producto-card-activa' : ''}`}>
              <div className="menu-producto-info">
                {prod.imagen ? (
                  <img src={prod.imagen} alt="" className="menu-producto-thumb" />
                ) : (
                  <span className="menu-producto-thumb-sin"><ImageIcon size={24} /></span>
                )}
                <div>
                  <span className="menu-producto-nombre">{prod.nombre}</span>
                  <span className="menu-producto-meta">
                    {getCategoriaNombre(prod.categoriaId)} · ${Number(prod.precio).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
              <label className="menu-categoria-toggle">
                <input type="checkbox" checked={enMenu} onChange={() => toggleProductoEnMenu(prod.id)} aria-label={`${enMenu ? 'Quitar' : 'Incluir'} ${prod.nombre} en el menú`} />
                <span className="menu-categoria-switch" />
              </label>
            </div>
          )
        })}
      </div>
      <p className="menu-categoria-hint">
        Los productos se gestionan en <strong>Maestros → Productos</strong>. Aquí solo defines cuáles se reflejan en el menú.
      </p>
    </PageModule>
  )
}
