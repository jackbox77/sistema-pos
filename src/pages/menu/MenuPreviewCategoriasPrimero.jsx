import { useState } from 'react'
import { Image as ImageIcon, ChevronLeft, UtensilsCrossed } from 'lucide-react'
import './MenuPreviewCategoriasPrimero.css'

const aparienciaDefault = {
  colorFondo: '#fefce8',
  colorContenido: '#ffffff',
  colorTexto: '#1f2937',
  colorTitulo: '#1f2937',
  imagenFondo: '',
}

const empresaDefault = { logoUrl: '', nombreEmpresa: '', subtitulo: '' }

export default function MenuPreviewCategoriasPrimero({ categorias, apariencia = aparienciaDefault, empresaInfo = empresaDefault }) {
  const empresa = { ...empresaDefault, ...empresaInfo }
  const [vista, setVista] = useState('categorias') // 'categorias' | 'menu'
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)

  const {
    colorFondo,
    colorContenido,
    colorTexto,
    colorTitulo,
    imagenFondo,
  } = { ...aparienciaDefault, ...apariencia }

  const styleFondo = imagenFondo
    ? { background: `url(${imagenFondo}) center/cover no-repeat`, backgroundColor: colorFondo }
    : { backgroundColor: colorFondo }

  const categoria = categorias.find((c) => c.id === categoriaSeleccionada)
  const items = categoria?.items ?? []

  const verCategoria = (cat) => {
    setCategoriaSeleccionada(cat.id)
    setVista('menu')
  }

  const volverACategorias = () => {
    setVista('categorias')
    setCategoriaSeleccionada(null)
  }

  return (
    <div className="menu-preview menu-preview-cat-primero" style={styleFondo}>
      <div className="menu-preview-cat-primero-inner" style={{ backgroundColor: colorContenido }}>
        {vista === 'categorias' ? (
          <>
            {/* Pantalla 1: Logo + lista de categorías */}
            <header className="menu-preview-cat-primero-header" style={{ borderBottomColor: `${colorTexto}20` }}>
              {empresa.logoUrl ? (
                <div className="menu-preview-cat-primero-logo-img">
                  <img src={empresa.logoUrl} alt="" />
                </div>
              ) : (
                <div className="menu-preview-cat-primero-logo" style={{ borderColor: `${colorTexto}40`, color: colorTexto }}>
                  Logo
                </div>
              )}
              <h2 className="menu-preview-cat-primero-titulo" style={{ color: colorTitulo }}>
                {empresa.nombreEmpresa || 'Menú'}
              </h2>
              <p className="menu-preview-cat-primero-subtitulo" style={{ color: colorTexto }}>
                {empresa.subtitulo || 'Elige una categoría'}
              </p>
            </header>
            <div className="menu-preview-cat-primero-body">
              {categorias.length === 0 ? (
                <p className="menu-preview-cat-primero-empty" style={{ color: colorTexto }}>
                  Añade categorías y productos para ver la vista previa.
                </p>
              ) : (
                <div className="menu-preview-cat-primero-grid">
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className="menu-preview-cat-primero-card"
                      style={{
                        borderColor: `${colorTexto}30`,
                        backgroundColor: `${colorContenido}`,
                        color: colorTitulo,
                      }}
                      onClick={() => verCategoria(cat)}
                    >
                      <span className="menu-preview-cat-primero-card-icon" style={{ color: colorTexto }}>
                        <UtensilsCrossed size={28} />
                      </span>
                      <span className="menu-preview-cat-primero-card-nombre">{cat.nombre}</span>
                      {cat.items?.length > 0 && (
                        <span className="menu-preview-cat-primero-card-count" style={{ color: colorTexto }}>
                          {cat.items.length} {cat.items.length === 1 ? 'producto' : 'productos'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Pantalla 2: Volver + nombre categoría + productos */}
            <header className="menu-preview-cat-primero-header menu-preview-cat-primero-header-menu" style={{ borderBottomColor: `${colorTexto}20` }}>
              <button
                type="button"
                className="menu-preview-cat-primero-back"
                style={{ color: colorTitulo }}
                onClick={volverACategorias}
                aria-label="Volver a categorías"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="menu-preview-cat-primero-titulo-menu" style={{ color: colorTitulo }}>
                {categoria?.nombre ?? 'Menú'}
              </h2>
            </header>
            <div className="menu-preview-cat-primero-body">
              {items.length === 0 ? (
                <p className="menu-preview-cat-primero-empty" style={{ color: colorTexto }}>
                  No hay productos en esta categoría.
                </p>
              ) : (
                <ul className="menu-preview-cat-primero-lista">
                  {items.map((item) => (
                    <li key={item.id} className="menu-preview-cat-primero-item" style={{ borderColor: `${colorTexto}15` }}>
                      <div className="menu-preview-cat-primero-item-img">
                        {item.imagen ? (
                          <img src={item.imagen} alt="" />
                        ) : (
                          <span style={{ color: `${colorTexto}50` }}>
                            <ImageIcon size={24} />
                          </span>
                        )}
                      </div>
                      <div className="menu-preview-cat-primero-item-content">
                        <span className="menu-preview-cat-primero-item-nombre" style={{ color: colorTitulo }}>
                          {item.nombre}
                        </span>
                        {item.descripcion && (
                          <p className="menu-preview-cat-primero-item-desc" style={{ color: colorTexto }}>
                            {item.descripcion}
                          </p>
                        )}
                        <span className="menu-preview-cat-primero-item-precio" style={{ color: colorTexto }}>
                          $ {typeof item.precio === 'number' ? item.precio.toLocaleString('es-CO') : item.precio}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="menu-preview-cat-primero-btn-agregar"
                        style={{ backgroundColor: colorTitulo, color: colorContenido }}
                      >
                        Agregar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
