import { useState, useEffect, useCallback } from 'react'
import PageModule from '../../components/PageModule/PageModule'
import { Image, FolderOpen, Trash2, Settings, Type } from 'lucide-react'
import { getProfileUseCase, updateProfileUseCase } from '../../feature/menu-config'
import { useMenu } from './MenuContext'
import MenuImage from './MenuImage'
import './ConfigurarEmpresa.css'

export default function ConfigurarEmpresa() {
  const { loadProfile } = useMenu()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [colorTexto, setColorTexto] = useState('#2D4048')
  const [logoUrl, setLogoUrl] = useState('')
  const [fotos, setFotos] = useState([null, null, null])
  const [nombreEmpresa, setNombreEmpresa] = useState('')
  const [tipoNegocio, setTipoNegocio] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const cargarPerfil = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await getProfileUseCase()
      if (res?.success && res?.data) {
        const { company, menu_config } = res.data
        if (company) {
          setLogoUrl(company.logo ?? '')
          setNombreEmpresa(company.name ?? '')
          setTipoNegocio(company.business_type ?? '')
          setDescripcion(company.description ?? '')
        }
        if (menu_config?.text_color) setColorTexto(menu_config.text_color)
      }
    } catch (err) {
      setError(err?.message ?? 'Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarPerfil()
  }, [cargarPerfil])

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setLogoUrl(URL.createObjectURL(file))
  }
  const handleLogoRemove = () => setLogoUrl('')

  const handleFotoChange = (index, e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotos((prev) => {
        const next = [...prev]
        if (next[index]) URL.revokeObjectURL(next[index])
        next[index] = URL.createObjectURL(file)
        return next
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const logo = typeof logoUrl === 'string' && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) ? logoUrl : undefined
      await updateProfileUseCase({
        company: {
          name: nombreEmpresa.trim() || undefined,
          description: descripcion.trim() || undefined,
          ...(logo != null && { logo }),
          business_type: tipoNegocio.trim() || undefined,
        },
        menu_config: {
          text_color: colorTexto || undefined,
        },
      })
      await loadProfile()
    } catch (err) {
      setError(err?.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageModule
      title="Configuración de la empresa"
      description="Logo, imágenes, color de marca y datos visibles de tu negocio."
    >
      {error && (
        <p role="alert" style={{ color: '#dc2626', fontSize: '14px', marginBottom: '12px' }}>
          {error}
        </p>
      )}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Cargando configuración...</p>
      ) : (
        <form className="config-empresa-form" onSubmit={handleSubmit}>
          <div className="config-empresa-grid">
            {/* Columna izquierda */}
            <div className="config-empresa-col">
              <div className="config-empresa-card">
                <h3 className="config-empresa-card-title">
                  <Image size={20} aria-hidden />
                  Logo de la empresa
                </h3>
                <div className="config-empresa-logo-wrap">
                  <div className="config-empresa-logo-preview">
                    <MenuImage
                      src={logoUrl}
                      wrapperClassName="config-empresa-logo-placeholder"
                      iconSize={32}
                    />
                  </div>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    className="config-empresa-input-file"
                    id="logo-empresa"
                    onChange={handleLogoChange}
                  />
                  <label htmlFor="logo-empresa" className="config-empresa-btn-upload">
                    Seleccionar logo
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      className="config-empresa-btn-remove"
                      onClick={handleLogoRemove}
                    >
                      <Trash2 size={16} />
                      Eliminar logo
                    </button>
                  )}
                </div>
                <p className="config-empresa-hint">
                  Formato PNG o JPG recomendado. Tamaño sugerido para mejor nitidez: cuadrado.
                </p>
              </div>

              <div className="config-empresa-card">
                <h3 className="config-empresa-card-title">
                  <Image size={20} aria-hidden />
                  Fotos de la empresa
                </h3>
                <div className="config-empresa-fotos">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="config-empresa-foto-slot">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        className="config-empresa-input-file"
                        id={`foto-empresa-${i}`}
                        onChange={(e) => handleFotoChange(i, e)}
                      />
                      {fotos[i] ? (
                        <div className="config-empresa-foto-preview">
                          <MenuImage
                            src={fotos[i]}
                            className="config-empresa-foto-img"
                            wrapperClassName="config-empresa-foto-placeholder"
                            iconSize={28}
                          />
                        </div>
                      ) : (
                        <label htmlFor={`foto-empresa-${i}`} className="config-empresa-foto-upload">
                          <span className="config-empresa-foto-plus">+</span>
                          <span className="config-empresa-foto-label">
                            <FolderOpen size={18} />
                            Subir imagen
                          </span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                <p className="config-empresa-hint">
                  Hasta 3 fotos. Usa imágenes horizontales para mejor visualización (16:9 recomendado).
                </p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="config-empresa-col">
              <div className="config-empresa-card">
                <h3 className="config-empresa-card-title">
                  <Settings size={20} aria-hidden />
                  Color del texto
                </h3>
                <div className="config-empresa-color-wrap">
                  <input
                    type="color"
                    value={colorTexto}
                    onChange={(e) => setColorTexto(e.target.value)}
                    className="config-empresa-color-input"
                    aria-label="Color del texto"
                  />
                  <input
                    type="text"
                    value={colorTexto}
                    onChange={(e) => setColorTexto(e.target.value)}
                    className="config-empresa-color-hex"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="config-empresa-card">
                <h3 className="config-empresa-card-title">
                  <Type size={20} aria-hidden />
                  Datos de la empresa
                </h3>
                <div className="config-empresa-datos">
                  <div className="config-field">
                    <label>Nombre de la empresa</label>
                    <input
                      type="text"
                      value={nombreEmpresa}
                      onChange={(e) => setNombreEmpresa(e.target.value)}
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  <div className="config-field">
                    <label>Tipo de negocio</label>
                    <input
                      type="text"
                      value={tipoNegocio}
                      onChange={(e) => setTipoNegocio(e.target.value)}
                      placeholder="Ej: Retail, Servicios, Restaurante, etc."
                    />
                  </div>
                  <div className="config-field">
                    <label>Descripción</label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Breve descripción de tu negocio para clientes o comprobantes."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="config-empresa-actions">
            <button type="submit" className="config-empresa-btn-guardar" disabled={saving}>
              <Settings size={20} aria-hidden />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}
    </PageModule>
  )
}
