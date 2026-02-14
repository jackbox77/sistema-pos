import { Image as ImageIcon } from 'lucide-react'
import MenuPreviewTarjetas from './MenuPreviewTarjetas'
import MenuPreviewCategoriasPrimero from './MenuPreviewCategoriasPrimero'
import MenuPreviewPlatosHorizontal from './MenuPreviewPlatosHorizontal'
import './Menu.css'

const aparienciaDefault = {
  colorFondo: '#fefce8',
  colorContenido: '#ffffff',
  colorTexto: '#1f2937',
  colorTitulo: '#1f2937',
  imagenFondo: '',
}

const empresaDefault = { logoUrl: '', nombreEmpresa: '', subtitulo: '', tipoNegocio: '', descripcion: '' }

export default function MenuPreview({ categorias, apariencia = aparienciaDefault, tipoMenu = 'clasico', empresaInfo = empresaDefault }) {
  const empresa = { ...empresaDefault, ...empresaInfo }
  if (tipoMenu === 'tarjetas-categorias') {
    return (
      <MenuPreviewTarjetas categorias={categorias} apariencia={apariencia} empresaInfo={empresa} />
    )
  }
  if (tipoMenu === 'categorias-primero') {
    return (
      <MenuPreviewCategoriasPrimero categorias={categorias} apariencia={apariencia} empresaInfo={empresa} />
    )
  }
  if (tipoMenu === 'platos-horizontal') {
    return (
      <MenuPreviewPlatosHorizontal categorias={categorias} apariencia={apariencia} empresaInfo={empresa} />
    )
  }
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

  return (
    <div className="menu-preview" style={styleFondo}>
      <div className="menu-preview-inner" style={{ backgroundColor: colorContenido }}>
        <header
          className="menu-preview-header"
          style={{ borderBottomColor: colorTitulo }}
        >
          {empresa.logoUrl ? (
            <div className="menu-preview-empresa-logo-img">
              <img src={empresa.logoUrl} alt="" />
            </div>
          ) : (
            <div className="menu-preview-empresa-logo" style={{ borderColor: `${colorTexto}40`, color: colorTexto }}>
              Logo
            </div>
          )}
          <h2 className="menu-preview-titulo" style={{ color: colorTitulo }}>
            {empresa.nombreEmpresa || 'Menú'}
          </h2>
          <p className="menu-preview-subtitulo" style={{ color: colorTexto }}>
            {empresa.subtitulo || 'Tu restaurante'}
          </p>
        </header>
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
                  style={{ color: colorTitulo, borderBottomColor: colorTexto }}
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
                        style={{ borderBottomColor: `${colorTexto}20` }}
                      >
                        <div className="menu-preview-item-content">
                          {item.imagen ? (
                            <img src={item.imagen} alt="" className="menu-preview-item-img" />
                          ) : (
                            <span className="menu-preview-item-img-sin">
                              <ImageIcon size={24} />
                            </span>
                          )}
                          <div className="menu-preview-item-texto">
                            <span
                              className="menu-preview-item-nombre"
                              style={{ color: colorTexto }}
                            >
                              {item.nombre}
                            </span>
                            {item.descripcion && (
                              <span
                                className="menu-preview-item-desc"
                                style={{ color: colorTexto }}
                              >
                                {item.descripcion}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className="menu-preview-item-precio"
                          style={{ color: colorTitulo }}
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
      </div>
    </div>
  )
}
