import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import MenuHeader from './MenuHeader'
import './MenuPreviewTarjetas.css'

const aparienciaDefault = {
  colorFondo: '#f8f9fa',
  colorContenido: '#ffffff',
  colorTexto: '#4a5568',
  colorTitulo: '#1a202c',
  imagenFondo: '',
}

const empresaDefault = { logoUrl: '', nombreEmpresa: '', subtitulo: '' }

/** Vista estilo Pirpos/Loggro: header limpio, barra de categorías, tarjetas de productos */
export default function MenuPreviewTarjetas({ categorias, apariencia = aparienciaDefault, empresaInfo = empresaDefault, mostrarImagenes = true, mostrarVerMas = true, tipoHeader = 'clasico' }) {
  const empresa = { ...empresaDefault, ...empresaInfo }
  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0]?.id ?? null)

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

  const categoriaSeleccionada = categorias.find((c) => c.id === categoriaActiva)
  const items = categoriaSeleccionada?.items ?? []

  return (
    <div className="menu-preview menu-preview-tarjetas menu-preview-pirpos" style={styleFondo}>
      <div className="menu-preview-tarjetas-inner" style={{ backgroundColor: colorContenido }}>
        <MenuHeader
          tipoHeader={tipoHeader}
          empresaInfo={empresa}
          apariencia={apariencia}
          className="menu-preview-tarjetas-header"
          style={{ borderBottomColor: `${colorTexto}15` }}
        />

        {/* Barra de categorías sticky (estilo Pirpos) */}
        {categorias.length > 0 && (
          <div
            className="menu-preview-tarjetas-bar-wrap"
            style={{ backgroundColor: colorContenido, borderBottomColor: `${colorTexto}12` }}
          >
            <div className="menu-preview-tarjetas-bar" role="tablist">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={categoriaActiva === cat.id}
                  className={`menu-preview-tarjetas-pill ${categoriaActiva === cat.id ? 'menu-preview-tarjetas-pill-active' : ''}`}
                  style={
                    categoriaActiva === cat.id
                      ? { backgroundColor: colorTitulo, color: colorContenido }
                      : { backgroundColor: `${colorTexto}10`, color: colorTexto }
                  }
                  onClick={() => setCategoriaActiva(cat.id)}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tarjetas de productos */}
        <div className="menu-preview-tarjetas-body">
          {categorias.length === 0 ? (
            <p className="menu-preview-tarjetas-empty" style={{ color: colorTexto }}>
              Añade categorías y productos para ver la vista previa.
            </p>
          ) : items.length === 0 ? (
            <p className="menu-preview-tarjetas-empty" style={{ color: colorTexto }}>
              No hay productos en esta categoría.
            </p>
          ) : (
            <ul className="menu-preview-tarjetas-lista">
              {items.map((item) => (
                <li key={item.id} className={`menu-preview-tarjetas-card ${!mostrarImagenes ? 'menu-preview-tarjetas-card-solo-texto' : ''}`} style={{ backgroundColor: colorContenido, borderColor: `${colorTexto}12` }}>
                  {mostrarImagenes && (
                    <div className="menu-preview-tarjetas-card-img">
                      {item.imagen ? (
                        <img src={item.imagen} alt="" />
                      ) : (
                        <span className="menu-preview-tarjetas-card-img-sin" style={{ color: `${colorTexto}35` }}>
                          <ImageIcon size={32} />
                        </span>
                      )}
                    </div>
                  )}
                  <div className="menu-preview-tarjetas-card-content">
                    <span className="menu-preview-tarjetas-card-nombre" style={{ color: colorTitulo }}>
                      {item.nombre}
                    </span>
                    {item.descripcion && (
                      <p className="menu-preview-tarjetas-card-desc" style={{ color: colorTexto }}>
                        {item.descripcion}
                      </p>
                    )}
                    <span className="menu-preview-tarjetas-card-precio" style={{ color: colorTitulo }}>
                      $ {typeof item.precio === 'number' ? item.precio.toLocaleString('es-CO') : item.precio}
                    </span>
                  </div>
                  {mostrarVerMas && (
                    <button
                      type="button"
                      className="menu-preview-tarjetas-btn-agregar"
                      style={{ backgroundColor: colorTitulo, color: colorContenido }}
                    >
                      Ver más
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
