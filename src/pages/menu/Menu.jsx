import { Link } from 'react-router-dom'
import PageModule from '../../components/PageModule/PageModule'
import MenuPreview from './MenuPreview'
import { useMenu, TIPOS_MENU } from './MenuContext'
import { Trash2, Settings } from 'lucide-react'
import './Menu.css'
import './ConfigurarEmpresa.css'

export default function Menu() {
  const { apariencia, setApariencia, empresaInfo, setEmpresaInfo, categoriasConProductos, tipoMenu, setTipoMenu } = useMenu()

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setEmpresaInfo((prev) => ({ ...prev, logoUrl: URL.createObjectURL(file) }))
  }
  const handleLogoRemove = () => setEmpresaInfo((prev) => ({ ...prev, logoUrl: '' }))

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <PageModule
      title="Editor de menú"
      description="Información de la empresa, diseño del menú y vista previa. Todo lo que se muestra en el menú se configura aquí."
    >
      <form className="menu-unificado-form" onSubmit={handleSubmit}>
        <div className="menu-layout">
          <div className="menu-editor">
            <section className="menu-editor-section config-empresa-form">
              <h3 className="menu-editor-title">Información de la empresa</h3>
              <div className="config-empresa-grid">
                <div className="config-empresa-col">
                  <div className="config-empresa-card">
                    <h4 className="config-empresa-card-title">Logo de la empresa</h4>
                    <div className="config-empresa-logo-wrap">
                      <div className="config-empresa-logo-preview">
                        {empresaInfo.logoUrl ? (
                          <img src={empresaInfo.logoUrl} alt="Logo" />
                        ) : (
                          <span className="config-empresa-logo-placeholder">Logo</span>
                        )}
                      </div>
                      <input type="file" accept=".png,.jpg,.jpeg" className="config-empresa-input-file" id="logo-empresa" onChange={handleLogoChange} />
                      <label htmlFor="logo-empresa" className="config-empresa-btn-upload">Seleccionar logo</label>
                      {empresaInfo.logoUrl && (
                        <button type="button" className="config-empresa-btn-remove" onClick={handleLogoRemove}>
                          <Trash2 size={16} /> Eliminar logo
                        </button>
                      )}
                    </div>
                    <p className="config-empresa-hint">Formato PNG o JPG recomendado.</p>
                  </div>
                </div>
                <div className="config-empresa-col">
                  <div className="config-empresa-card">
                    <h4 className="config-empresa-card-title">Datos de la empresa</h4>
                    <div className="config-empresa-datos">
                      <div className="config-field">
                        <label>Nombre de la empresa</label>
                        <input type="text" value={empresaInfo.nombreEmpresa} onChange={(e) => setEmpresaInfo((p) => ({ ...p, nombreEmpresa: e.target.value }))} placeholder="Ej: La Terraza" />
                      </div>
                      <div className="config-field">
                        <label>Subtítulo</label>
                        <input type="text" value={empresaInfo.subtitulo} onChange={(e) => setEmpresaInfo((p) => ({ ...p, subtitulo: e.target.value }))} placeholder="Ej: Cocina casera" />
                      </div>
                      <div className="config-field">
                        <label>Tipo de negocio</label>
                        <input type="text" value={empresaInfo.tipoNegocio} onChange={(e) => setEmpresaInfo((p) => ({ ...p, tipoNegocio: e.target.value }))} placeholder="Ej: Restaurante" />
                      </div>
                      <div className="config-field">
                        <label>Descripción</label>
                        <textarea value={empresaInfo.descripcion} onChange={(e) => setEmpresaInfo((p) => ({ ...p, descripcion: e.target.value }))} placeholder="Breve descripción" rows={4} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="menu-editor-section">
              <h3 className="menu-editor-title">Tipo de menú</h3>
              <div className="menu-tipo-opciones">
                {TIPOS_MENU.map((tipo) => (
                  <label key={tipo.id} className="menu-tipo-opcion">
                    <input type="radio" name="tipoMenu" value={tipo.id} checked={tipoMenu === tipo.id} onChange={() => setTipoMenu(tipo.id)} />
                    <span>{tipo.label}</span>
                  </label>
                ))}
              </div>
            </section>
            <section className="menu-editor-section">
              <h3 className="menu-editor-title">Apariencia del menú</h3>
              <div className="menu-apariencia-grid">
                <div className="menu-apariencia-field">
                  <label>Fondo del menú</label>
                  <div className="menu-apariencia-color">
                    <input type="color" value={apariencia.colorFondo} onChange={(e) => setApariencia((a) => ({ ...a, colorFondo: e.target.value }))} aria-label="Color de fondo" />
                    <input type="text" value={apariencia.colorFondo} onChange={(e) => setApariencia((a) => ({ ...a, colorFondo: e.target.value }))} className="menu-apariencia-hex" />
                  </div>
                </div>
                <div className="menu-apariencia-field">
                  <label>Fondo del contenido</label>
                  <div className="menu-apariencia-color">
                    <input type="color" value={apariencia.colorContenido} onChange={(e) => setApariencia((a) => ({ ...a, colorContenido: e.target.value }))} aria-label="Color del contenido" />
                    <input type="text" value={apariencia.colorContenido} onChange={(e) => setApariencia((a) => ({ ...a, colorContenido: e.target.value }))} className="menu-apariencia-hex" />
                  </div>
                </div>
                <div className="menu-apariencia-field">
                  <label>Color del texto</label>
                  <div className="menu-apariencia-color">
                    <input type="color" value={apariencia.colorTexto} onChange={(e) => setApariencia((a) => ({ ...a, colorTexto: e.target.value }))} aria-label="Color del texto" />
                    <input type="text" value={apariencia.colorTexto} onChange={(e) => setApariencia((a) => ({ ...a, colorTexto: e.target.value }))} className="menu-apariencia-hex" />
                  </div>
                </div>
                <div className="menu-apariencia-field">
                  <label>Color de títulos</label>
                  <div className="menu-apariencia-color">
                    <input type="color" value={apariencia.colorTitulo} onChange={(e) => setApariencia((a) => ({ ...a, colorTitulo: e.target.value }))} aria-label="Color de títulos" />
                    <input type="text" value={apariencia.colorTitulo} onChange={(e) => setApariencia((a) => ({ ...a, colorTitulo: e.target.value }))} className="menu-apariencia-hex" />
                  </div>
                </div>
              </div>
              <div className="menu-form-actions">
                <button type="submit" className="config-empresa-btn-guardar">
                  <Settings size={20} aria-hidden />
                  Guardar
                </button>
              </div>
            </section>
          </div>
          <div className="menu-preview-wrap">
            <div className="menu-preview-header-actions">
              <h3 className="menu-preview-label">Vista previa del menú</h3>
              <Link to="/app/menu/vista-completa" className="btn-secondary menu-preview-btn" target="_blank" rel="noopener noreferrer">
                Ver menú completo
              </Link>
            </div>
            <MenuPreview categorias={categoriasConProductos} apariencia={apariencia} tipoMenu={tipoMenu} empresaInfo={empresaInfo} />
          </div>
        </div>
      </form>
    </PageModule>
  )
}
