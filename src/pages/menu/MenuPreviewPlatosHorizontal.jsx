import { Image as ImageIcon } from 'lucide-react'
import MenuHeader from './MenuHeader'
import './MenuPreviewPlatosHorizontal.css'

const aparienciaDefault = {
  colorFondo: '#fefce8',
  colorContenido: '#ffffff',
  colorTexto: '#1f2937',
  colorTitulo: '#1f2937',
  imagenFondo: '',
}

const empresaDefault = { logoUrl: '', nombreEmpresa: '', subtitulo: '' }

export default function MenuPreviewPlatosHorizontal({ categorias, apariencia = aparienciaDefault, empresaInfo = empresaDefault, mostrarImagenes = true, mostrarVerMas = true, tipoHeader = 'clasico' }) {
  const empresa = { ...empresaDefault, ...empresaInfo }
  const { colorFondo, colorContenido, colorTexto, colorTitulo, imagenFondo } = {
    ...aparienciaDefault,
    ...apariencia,
  }

  const styleFondo = imagenFondo
    ? { background: `url(${imagenFondo}) center/cover no-repeat`, backgroundColor: colorFondo }
    : { backgroundColor: colorFondo }

  return (
    <div className="menu-preview menu-preview-platos-h" style={styleFondo}>
      <div className="menu-preview-platos-h-inner" style={{ backgroundColor: colorContenido }}>
        <MenuHeader
          tipoHeader={tipoHeader}
          empresaInfo={empresa}
          apariencia={apariencia}
          className="menu-preview-platos-h-header"
          style={{ borderBottomColor: `${colorTexto}20` }}
        />

        <div className="menu-preview-platos-h-body">
          {categorias.length === 0 ? (
            <p className="menu-preview-platos-h-empty" style={{ color: colorTexto }}>
              Añade categorías y productos para ver la vista previa.
            </p>
          ) : (
            categorias.map((cat) => (
              <section key={cat.id} className="menu-preview-platos-h-seccion">
                <h3 className="menu-preview-platos-h-seccion-titulo" style={{ color: colorTitulo }}>
                  {cat.nombre}
                </h3>
                {cat.items?.length > 0 && (
                  <p className="menu-preview-platos-h-seccion-desc" style={{ color: colorTexto }}>
                    Productos de {cat.nombre.toLowerCase()}
                  </p>
                )}
                {cat.items?.length === 0 ? (
                  <p className="menu-preview-platos-h-sin-productos" style={{ color: colorTexto }}>
                    Sin productos
                  </p>
                ) : (
                  <div className="menu-preview-platos-h-fila">
                    {cat.items.map((item) => (
                      <article
                        key={item.id}
                        className={`menu-preview-platos-h-card ${!mostrarImagenes ? 'menu-preview-platos-h-card-solo-texto' : ''}`}
                        style={{ borderColor: `${colorTexto}25` }}
                      >
                        {mostrarImagenes && (
                          <div className="menu-preview-platos-h-card-img">
                            {item.imagen ? (
                              <img src={item.imagen} alt="" />
                            ) : (
                              <span
                                className="menu-preview-platos-h-card-img-sin"
                                style={{ color: `${colorTexto}40` }}
                              >
                                <ImageIcon size={32} />
                              </span>
                            )}
                          </div>
                        )}
                        <div className="menu-preview-platos-h-card-content">
                          <span
                            className="menu-preview-platos-h-card-nombre"
                            style={{ color: colorTitulo }}
                          >
                            {item.nombre}
                          </span>
                          {item.descripcion && (
                            <p
                              className="menu-preview-platos-h-card-desc"
                              style={{ color: colorTexto }}
                            >
                              {item.descripcion}
                            </p>
                          )}
                          <span
                            className="menu-preview-platos-h-card-precio"
                            style={{ color: colorTexto }}
                          >
                            $ {typeof item.precio === 'number' ? item.precio.toLocaleString('es-CO') : item.precio}
                          </span>
                        </div>
                        {mostrarVerMas && (
                          <button
                            type="button"
                            className="menu-preview-platos-h-card-btn"
                            style={{ backgroundColor: colorTitulo, color: colorContenido }}
                          >
                            Ver más
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
