import PageModule from '../../components/PageModule/PageModule'
import { useMenu } from './MenuContext'
import './MenuCategoria.css'

export default function MenuCategoria() {
  const { categoriasDisponibles, categoriasEnMenu, toggleCategoriaEnMenu } = useMenu()

  return (
    <PageModule
      title="Categorías en el menú"
      description="Elige qué categorías del maestro Categorías se muestran en el menú. Las que actives aquí aparecerán en el editor y en la vista previa."
    >
      <div className="menu-categoria-list">
        {categoriasDisponibles.map((cat) => {
          const enMenu = categoriasEnMenu.includes(cat.id)
          return (
            <div key={cat.id} className={`menu-categoria-card ${enMenu ? 'menu-categoria-card-activa' : ''}`}>
              <div className="menu-categoria-info">
                <span className="menu-categoria-nombre">{cat.nombre}</span>
                <span className="menu-categoria-badge">{enMenu ? 'En el menú' : 'Oculta'}</span>
              </div>
              <label className="menu-categoria-toggle">
                <input type="checkbox" checked={enMenu} onChange={() => toggleCategoriaEnMenu(cat.id)} aria-label={`${enMenu ? 'Quitar' : 'Incluir'} ${cat.nombre} en el menú`} />
                <span className="menu-categoria-switch" />
              </label>
            </div>
          )
        })}
      </div>
      <p className="menu-categoria-hint">
        Las categorías se gestionan en Maestros - Categorías. Aquí solo defines cuáles se reflejan en el menú.
      </p>
    </PageModule>
  )
}
