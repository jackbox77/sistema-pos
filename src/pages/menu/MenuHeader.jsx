import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import './MenuHeader.css'

const empresaDefault = { logoUrl: '', nombreEmpresa: '', subtitulo: '' }

function LogoImg({ src }) {
  const [error, setError] = useState(false)
  if (!src || error) {
    return (
      <span className="menu-header-logo-fallback" aria-hidden>
        <ImageIcon size={32} />
      </span>
    )
  }
  return <img src={src} alt="" onError={() => setError(true)} />
}

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
  const {
    colorTexto,
    colorTitulo,
    colorSubtitulo = colorTexto || '#6b7280',
    colorAcento = colorTitulo || '#1f2937',
    imagenHeaderFondo,
  } = apariencia || {}

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
              <LogoImg src={empresa.logoUrl} />
            </div>
          )}
          <h2 className="menu-header-imagen-fondo-titulo">{empresa.nombreEmpresa || 'Menú'}</h2>
          {empresa.subtitulo && (
            <p className="menu-header-imagen-fondo-sub" style={{ color: '#ffffff' }}>
              {empresa.subtitulo}
            </p>
          )}
        </div>
      </header>
    )
  }

  // Header minimalista
  if (tipoHeader === 'minimalista') {
    return (
      <header
        className={`menu-header menu-header-minimalista ${className}`}
        style={{ borderBottomColor: colorAcento || `${colorTexto || '#1f2937'}25`, ...style }}
      >
        <h2 className="menu-header-minimalista-titulo" style={{ color: colorTitulo || '#1f2937' }}>
          {empresa.nombreEmpresa || 'Menú'}
        </h2>
        {empresa.subtitulo && (
          <p className="menu-header-minimalista-sub" style={{ color: colorSubtitulo || '#6b7280' }}>
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
        style={{ borderLeftColor: colorAcento || colorTitulo || '#1f2937', ...style }}
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
            <p className="menu-header-editorial-sub" style={{ color: colorSubtitulo || '#6b7280' }}>
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
      style={{ borderBottomColor: colorAcento || colorTitulo || '#1f2937', ...style }}
    >
      {empresa.logoUrl ? (
        <div className="menu-header-clasico-logo-img">
          <LogoImg src={empresa.logoUrl} />
        </div>
      ) : (
        <div className="menu-header-clasico-logo" style={{ borderColor: `${colorTexto || '#6b7280'}40`, color: colorTexto || '#6b7280' }}>
          Logo
        </div>
      )}
      <h2 className="menu-header-clasico-titulo" style={{ color: colorTitulo || '#1f2937' }}>
        {empresa.nombreEmpresa || 'Menú'}
      </h2>
      <p className="menu-header-clasico-sub" style={{ color: colorSubtitulo || '#6b7280' }}>
        {empresa.subtitulo || 'Tu restaurante'}
      </p>
    </header>
  )
}
