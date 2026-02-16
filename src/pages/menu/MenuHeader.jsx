import './MenuHeader.css'

const empresaDefault = { logoUrl: '', nombreEmpresa: '', subtitulo: '' }

/**
 * Encabezado reutilizable del menú con 4 variantes:
 * - clasico: logo centrado + nombre + subtítulo
 * - imagen-fondo: imagen de fondo con overlay, texto claro
 * - minimalista: solo tipografía elegante, sin logo
 * - editorial: alineado a la izquierda con barra de acento
 */
export default function MenuHeader({
  tipoHeader = 'clasico',
  empresaInfo = empresaDefault,
  apariencia = {},
  className = '',
  style = {},
}) {
  const empresa = { ...empresaDefault, ...empresaInfo }
  const { colorTexto, colorTitulo, imagenHeaderFondo } = apariencia

  // Header con imagen de fondo
  if (tipoHeader === 'imagen-fondo') {
    const styleBg = imagenHeaderFondo
      ? { background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url(${imagenHeaderFondo}) center/cover no-repeat` }
      : { background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }

    return (
      <header className={`menu-header menu-header-imagen-fondo ${className}`} style={{ ...styleBg, ...style }}>
        <div className="menu-header-imagen-fondo-content">
          {empresa.logoUrl && (
            <div className="menu-header-imagen-fondo-logo">
              <img src={empresa.logoUrl} alt="" />
            </div>
          )}
          <h2 className="menu-header-imagen-fondo-titulo">{empresa.nombreEmpresa || 'Menú'}</h2>
          {empresa.subtitulo && <p className="menu-header-imagen-fondo-sub">{empresa.subtitulo}</p>}
        </div>
      </header>
    )
  }

  // Header minimalista
  if (tipoHeader === 'minimalista') {
    return (
      <header
        className={`menu-header menu-header-minimalista ${className}`}
        style={{ borderBottomColor: `${colorTexto || '#1f2937'}25`, ...style }}
      >
        <h2 className="menu-header-minimalista-titulo" style={{ color: colorTitulo || '#1f2937' }}>
          {empresa.nombreEmpresa || 'Menú'}
        </h2>
        {empresa.subtitulo && (
          <p className="menu-header-minimalista-sub" style={{ color: colorTexto || '#6b7280' }}>
            {empresa.subtitulo}
          </p>
        )}
      </header>
    )
  }

  // Header editorial
  if (tipoHeader === 'editorial') {
    return (
      <header
        className={`menu-header menu-header-editorial ${className}`}
        style={{ borderLeftColor: colorTitulo || '#1f2937', ...style }}
      >
        {empresa.logoUrl && (
          <div className="menu-header-editorial-logo">
            <img src={empresa.logoUrl} alt="" />
          </div>
        )}
        <div className="menu-header-editorial-texto">
          <h2 className="menu-header-editorial-titulo" style={{ color: colorTitulo || '#1f2937' }}>
            {empresa.nombreEmpresa || 'Menú'}
          </h2>
          {empresa.subtitulo && (
            <p className="menu-header-editorial-sub" style={{ color: colorTexto || '#6b7280' }}>
              {empresa.subtitulo}
            </p>
          )}
        </div>
      </header>
    )
  }

  // Header clásico (por defecto)
  return (
    <header
      className={`menu-header menu-header-clasico ${className}`}
      style={{ borderBottomColor: colorTitulo || '#1f2937', ...style }}
    >
      {empresa.logoUrl ? (
        <div className="menu-header-clasico-logo-img">
          <img src={empresa.logoUrl} alt="" />
        </div>
      ) : (
        <div className="menu-header-clasico-logo" style={{ borderColor: `${colorTexto || '#6b7280'}40`, color: colorTexto || '#6b7280' }}>
          Logo
        </div>
      )}
      <h2 className="menu-header-clasico-titulo" style={{ color: colorTitulo || '#1f2937' }}>
        {empresa.nombreEmpresa || 'Menú'}
      </h2>
      <p className="menu-header-clasico-sub" style={{ color: colorTexto || '#6b7280' }}>
        {empresa.subtitulo || 'Tu restaurante'}
      </p>
    </header>
  )
}
