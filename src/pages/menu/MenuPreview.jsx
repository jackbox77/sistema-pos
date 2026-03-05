import MenuImage from './MenuImage'
import MenuPreviewTarjetas from './MenuPreviewTarjetas'
import MenuPreviewCategoriasPrimero from './MenuPreviewCategoriasPrimero'
import MenuPreviewPlatosHorizontal from './MenuPreviewPlatosHorizontal'
import MenuHeader from './MenuHeader'
import MenuContactBar from './MenuContactBar'
import './Menu.css'

const aparienciaDefault = {
  colorFondo: '#f8f9fa',
  colorContenido: '#ffffff',
  colorTexto: '#4a5568',
  colorTitulo: '#1a202c',
  colorSubtitulo: '#718096',
  colorPrecio: '#2d3748',
  colorAcento: '#C7D02C',
  colorIconoContacto: '#C7D02C',
  colorTextoContacto: '#ffffff',
  colorFondoContacto: '#134e4a',
  imagenFondo: '',
  imagenHeaderFondo: '',
}

const empresaDefault = { logoUrl: '', nombreEmpresa: '', subtitulo: '', tipoNegocio: '', descripcion: '' }

export default function MenuPreview({ categorias, apariencia = aparienciaDefault, tipoMenu = 'clasico', empresaInfo = empresaDefault, mostrarImagenes = true, mostrarVerMas = true, tipoHeader = 'clasico' }) {
  const empresa = { ...empresaDefault, ...empresaInfo }
  if (tipoMenu === 'tarjetas-categorias') {
    return (
      <MenuPreviewTarjetas categorias={categorias} apariencia={apariencia} empresaInfo={empresaInfo} mostrarImagenes={mostrarImagenes} mostrarVerMas={mostrarVerMas} tipoHeader={tipoHeader} />
    )
  }
  if (tipoMenu === 'categorias-primero') {
    return (
      <MenuPreviewCategoriasPrimero categorias={categorias} apariencia={apariencia} empresaInfo={empresaInfo} mostrarImagenes={mostrarImagenes} mostrarVerMas={mostrarVerMas} tipoHeader={tipoHeader} />
    )
  }
  if (tipoMenu === 'platos-horizontal') {
    return (
      <MenuPreviewPlatosHorizontal categorias={categorias} apariencia={apariencia} empresaInfo={empresaInfo} mostrarImagenes={mostrarImagenes} mostrarVerMas={mostrarVerMas} tipoHeader={tipoHeader} />
    )
  }
  const {
    colorFondo,
    colorContenido,
    colorTexto,
    colorTitulo,
    colorSubtitulo = colorTexto || '#4a5568',
    colorPrecio = colorTexto || '#2d3748',
    colorAcento = colorTitulo || '#C7D02C',
    imagenFondo,
  } = { ...aparienciaDefault, ...apariencia }

  const styleFondo = imagenFondo
    ? { background: `url(${imagenFondo}) center/cover no-repeat`, backgroundColor: colorFondo }
    : { backgroundColor: colorFondo }

  return (
    <div className="menu-preview" style={styleFondo}>
      <div className="menu-preview-inner" style={{ backgroundColor: colorContenido }}>
        <MenuHeader
          tipoHeader={tipoHeader}
          empresaInfo={empresa}
          apariencia={apariencia}
          className="menu-preview-header"
          style={{ borderBottomColor: colorAcento }}
        />
        {categorias.length === 0 ? (
          <p className="menu-preview-empty" style={{ color: colorTexto }}>
            Añade categorías y platos para ver la vista previa.
          </p>
        ) : (
          <div className="menu-preview-secciones">
            {categorias.map((seccion) => (
              <section key={seccion.id} className="menu-preview-seccion">
                <h3
                  className="menu-preview-seccion-titulo"
                  style={{ color: colorTitulo, borderBottomColor: colorAcento }}
                >
                  {seccion.nombre}
                </h3>
                {seccion.items.length === 0 ? (
                  <p className="menu-preview-seccion-empty" style={{ color: colorTexto }}>
                    Sin platos
                  </p>
                ) : (
                  <ul className="menu-preview-lista">
                    {seccion.items.map((item) => (
                      <li
                        key={item.id}
                        className="menu-preview-item"
                        style={{ borderBottomColor: `${colorAcento}40` }}
                      >
                        <div className="menu-preview-item-content">
                          {mostrarImagenes && (
                            <MenuImage
                              src={item.imagen}
                              className="menu-preview-item-img"
                              wrapperClassName="menu-preview-item-img-sin"
                              iconSize={24}
                            />
                          )}
                          <div className="menu-preview-item-texto">
                            <span
                              className="menu-preview-item-nombre"
                              style={{ color: colorTitulo }}
                            >
                              {item.nombre}
                            </span>
                            {item.descripcion && (
                              <span
                                className="menu-preview-item-desc"
                                style={{ color: colorSubtitulo }}
                              >
                                {item.descripcion}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className="menu-preview-item-precio"
                          style={{ color: colorPrecio }}
                        >
                          ${item.precio.toLocaleString('es-CO')}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
        <MenuContactBar empresaInfo={empresaInfo} apariencia={apariencia} />
      </div>
    </div>
  )
}
