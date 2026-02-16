import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageModule from '../../components/PageModule/PageModule'
import { Image as ImageIcon } from 'lucide-react'
import { useMenu } from './MenuContext'
import './MenuProductos.css'

export default function MenuProductos() {
  const { categoriasDisponibles, categoriasEnMenu, productosDisponibles, productosEnMenu, toggleProductoEnMenu } = useMenu()
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')

  const categoriasActivas = categoriasDisponibles.filter((c) => categoriasEnMenu.includes(c.id))
  const productosFiltrados =
    categoriaFiltro === 'todas'
      ? productosDisponibles.filter((p) => categoriasEnMenu.includes(p.categoriaId))
      : productosDisponibles.filter((p) => p.categoriaId === Number(categoriaFiltro))

  const getCategoriaNombre = (categoriaId) =>
    categoriasDisponibles.find((c) => c.id === categoriaId)?.nombre ?? '—'

  return (
    <PageModule
      title="Productos en el menú"
      description="Elige qué productos se muestran en el menú. Filtra por categoría (definidas en Categoría) y activa los que quieras."
    >
      <div className="menu-productos-filtros">
        <label>
          <span>Filtrar por categoría:</span>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="menu-productos-select"
          >
            <option value="todas">Todas las categorías</option>
            {categoriasActivas.map((cat) => (
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
        {categoriasActivas.length === 0 ? (
          <p className="menu-productos-vacio">
            No hay categorías activas. Ve a <Link to="/app/menu/categoria">Categoría</Link> y activa al menos una para ver productos.
          </p>
        ) : productosFiltrados.length === 0 ? (
          <p className="menu-productos-vacio">
            No hay productos en esta categoría. Añade productos en Maestros → Productos.
          </p>
        ) : (
        productosFiltrados.map((prod) => {
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
        })
        )}
      </div>
      <p className="menu-categoria-hint">
        Las categorías se definen en <Link to="/app/menu/categoria">Categoría</Link>. Los productos en <strong>Maestros → Productos</strong>. Aquí eliges cuáles se reflejan en el menú.
      </p>
    </PageModule>
  )
}
