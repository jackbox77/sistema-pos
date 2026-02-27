import { useState, useRef, useEffect, useCallback, useMemo, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PageModule from '../../components/PageModule/PageModule'
import MenuPreview from './MenuPreview'
import { useMenu, TIPOS_MENU, TIPOS_HEADER, CONTEXT_HEADER_TO_API, CONTEXT_MENU_TO_API } from './MenuContext'
import MenuContactBar from './MenuContactBar'
import { updateProfileUseCase, updateContactUseCase } from '../../feature/menu-config'
import { validateBucketUseCase, getBucketUseCase, createBucketUseCase, createFolderUseCase, uploadFileUseCase } from '../../feature/storage/use-case'
import { Trash2, Settings, Image as ImageIcon, FolderOpen, Plus, ChevronRight, Upload, X, MapPin, Phone, Mail, MessageCircle, Clock, CalendarDays } from 'lucide-react'
import './Menu.css'
import './ConfigurarEmpresa.css'
import '../../components/FormularioProductos/FormularioProductos.css'

/** Obtiene el nodo actual del árbol según la ruta de carpetas */
function getBucketCurrentNode(treeData, path) {
  const root = treeData?.data?.tree?.folders ?? {}
  if (path.length === 0) return { folders: root, images: [] }
  const node = path.reduce((n, name) => n?.folders?.[name], { folders: root })
  return node ?? { folders: {}, images: [] }
}

function BucketBrowserModal({ onSelectUrl, onClose }) {
  const [tree, setTree] = useState(null)
  const [currentPath, setCurrentPath] = useState(['menu-config'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [hasBucket, setHasBucket] = useState(null)
  const [creatingBucket, setCreatingBucket] = useState(false)
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const uploadInputRef = useRef(null)
  const newFolderInputRef = useRef(null)

  const loadBucketTree = useCallback(() => {
    setError(null)
    return getBucketUseCase()
      .then((res) => {
        if (res?.success) setTree(res)
        else setError(res?.message ?? 'No se pudo cargar el bucket')
      })
      .catch((err) => setError(err?.message ?? 'Error al cargar el bucket'))
  }, [])

  useEffect(() => {
    let cancelled = false
    setError(null)
    setLoading(true)
    setHasBucket(null)
    validateBucketUseCase()
      .then((res) => {
        if (cancelled) return
        if (!res?.success) {
          setError(res?.message ?? 'No se pudo validar el bucket')
          setLoading(false)
          return
        }
        const has = res?.data?.has_bucket === true
        setHasBucket(has)
        if (has) {
          return getBucketUseCase().then((bucketRes) => {
            if (!cancelled && bucketRes?.success) setTree(bucketRes)
            else if (!cancelled) setError(bucketRes?.message ?? 'No se pudo cargar el bucket')
          })
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Error al validar el bucket')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleCreateBucket = async () => {
    setError(null)
    setCreatingBucket(true)
    try {
      const res = await createBucketUseCase()
      if (res?.success) {
        setHasBucket(true)
        await loadBucketTree()
      } else {
        setError(res?.message ?? 'No se pudo crear el bucket')
      }
    } catch (err) {
      setError(err?.message ?? 'Error al crear el bucket')
    } finally {
      setCreatingBucket(false)
    }
  }

  const currentNode = useMemo(() => getBucketCurrentNode(tree, currentPath), [tree, currentPath])
  const folderNames = useMemo(() => Object.keys(currentNode.folders || {}), [currentNode.folders])
  const images = useMemo(() => currentNode.images || [], [currentNode.images])
  const pathString = currentPath.length === 0 ? '' : currentPath.join('/')

  const handleCreateFolder = async () => {
    const name = newFolderName.trim().replace(/[/\\]/g, '')
    if (!name) return
    setError(null)
    setCreatingFolder(true)
    try {
      const fullPath = pathString ? `${pathString}/${name}` : name
      const res = await createFolderUseCase(fullPath)
      if (res?.success) {
        setShowNewFolderInput(false)
        setNewFolderName('')
        await loadBucketTree()
        setCurrentPath((prev) => [...prev, name])
      } else {
        setError(res?.message ?? 'No se pudo crear la carpeta')
      }
    } catch (err) {
      setError(err?.message ?? 'Error al crear la carpeta')
    } finally {
      setCreatingFolder(false)
    }
  }

  useEffect(() => {
    if (showNewFolderInput && newFolderInputRef.current) newFolderInputRef.current.focus()
  }, [showNewFolderInput])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    e.target.value = ''
    setUploading(true)
    setError(null)
    try {
      const res = await uploadFileUseCase(file, pathString || 'general')
      if (res?.success && res?.data?.url) {
        onSelectUrl(res.data.url)
        onClose()
      } else {
        setError(res?.message ?? 'Error al subir')
      }
    } catch (err) {
      setError(err?.message ?? 'Error al subir el archivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="form-overlay bucket-browser-overlay" onClick={onClose} style={{ zIndex: 1001 }}>
      <div className="bucket-browser-modal-apple" onClick={(e) => e.stopPropagation()}>
        <div className="bucket-browser-header">
          <h3>Elegir imagen</h3>
          <button type="button" className="bucket-browser-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="bucket-browser-content">
          {loading && <p className="bucket-browser-loading">Validando bucket…</p>}
          {error && <p className="bucket-browser-error" role="alert">{error}</p>}
          {!loading && hasBucket === false && (
            <div className="bucket-browser-no-bucket">
              <p>No tienes un bucket de almacenamiento. Créalo para subir y elegir imágenes.</p>
              <button type="button" className="bucket-browser-btn-primary" onClick={handleCreateBucket} disabled={creatingBucket}>
                {creatingBucket ? 'Creando…' : 'Crear bucket'}
              </button>
            </div>
          )}
          {!loading && hasBucket && tree && (
            <>
              <nav className="bucket-browser-breadcrumb" aria-label="Ruta">
                <button type="button" onClick={() => { setCurrentPath([]); setShowNewFolderInput(false); }} className="bucket-breadcrumb-item">
                  Inicio
                </button>
                {currentPath.map((name, i) => (
                  <Fragment key={i}>
                    <span className="bucket-breadcrumb-sep">/</span>
                    <button
                      type="button"
                      onClick={() => { setCurrentPath(currentPath.slice(0, i + 1)); setShowNewFolderInput(false); }}
                      className="bucket-breadcrumb-item"
                    >
                      {name}
                    </button>
                  </Fragment>
                ))}
              </nav>
              <div className="bucket-browser-layout">
                <div className="bucket-browser-sidebar">
                  <div className="bucket-browser-list-wrap">
                    {folderNames.length > 0 && (
                      <ul className="bucket-browser-list" role="list">
                        {folderNames.map((name) => (
                          <li key={name}>
                            <button
                              type="button"
                              className="bucket-browser-list-row"
                              onClick={() => { setCurrentPath([...currentPath, name]); setShowNewFolderInput(false); }}
                            >
                              <FolderOpen size={20} className="bucket-browser-row-icon" />
                              <span className="bucket-browser-row-label">{name}</span>
                              <ChevronRight size={18} className="bucket-browser-row-chevron" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bucket-browser-actions">
                    {showNewFolderInput ? (
                      <div className="bucket-browser-new-folder-inline">
                        <input
                          ref={newFolderInputRef}
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateFolder()
                            if (e.key === 'Escape') { setShowNewFolderInput(false); setNewFolderName('') }
                          }}
                          placeholder="Nombre de la carpeta"
                          className="bucket-browser-new-folder-input"
                          disabled={creatingFolder}
                        />
                        <div className="bucket-browser-new-folder-btns">
                          <button type="button" className="bucket-browser-btn-ghost" onClick={() => { setShowNewFolderInput(false); setNewFolderName('') }} disabled={creatingFolder}>
                            Cancelar
                          </button>
                          <button type="button" className="bucket-browser-btn-primary" onClick={handleCreateFolder} disabled={creatingFolder || !newFolderName.trim()}>
                            {creatingFolder ? 'Creando…' : 'Crear'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" className="bucket-browser-btn-icon-folder" onClick={() => setShowNewFolderInput(true)} aria-label="Nueva carpeta" title="Nueva carpeta">
                        <Plus size={20} /> Nueva carpeta
                      </button>
                    )}
                  </div>
                </div>

                <div className="bucket-browser-main">
                  <label className="bucket-browser-upload-zone">
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="input-file"
                    />
                    <Upload size={28} style={{ opacity: 0.6 }} />
                    <span className="bucket-browser-upload-text">
                      {uploading ? 'Subiendo…' : 'Arrastra una imagen aquí o haz clic para subir'}
                    </span>
                  </label>

                  {images.length > 0 && (
                    <div className="bucket-browser-images-section">
                      <p className="bucket-browser-section-title">Imágenes</p>
                      <div className="bucket-browser-grid">
                        {images.map((img) => (
                          <button
                            key={img.key}
                            type="button"
                            className="bucket-browser-image-card"
                            onClick={() => {
                              onSelectUrl(img.url)
                              onClose()
                            }}
                          >
                            <img src={img.url} alt="" />
                            <span className="bucket-browser-image-name" title={img.key}>{img.key}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Menu() {
  const { apariencia, setApariencia, empresaInfo, setEmpresaInfo, categoriasConProductos, tipoMenu, setTipoMenu, mostrarImagenes, setMostrarImagenes, mostrarVerMas, setMostrarVerMas, tipoHeader, setTipoHeader, loadProfile, profileLoading } = useMenu()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [showLogoBucketBrowser, setShowLogoBucketBrowser] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleLogoSelect = (url) => {
    setEmpresaInfo((prev) => ({ ...prev, logoUrl: url }))
    setShowLogoBucketBrowser(false)
  }
  const handleLogoRemove = () => setEmpresaInfo((prev) => ({ ...prev, logoUrl: '' }))

  const handleHeaderFondoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setApariencia((prev) => ({ ...prev, imagenHeaderFondo: URL.createObjectURL(file) }))
  }
  const handleHeaderFondoRemove = () => setApariencia((prev) => ({ ...prev, imagenHeaderFondo: '' }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveError(null)
    setSaving(true)
    try {
      if (activeTab === 'general') {
        const logoUrl = empresaInfo.logoUrl
        const logo = typeof logoUrl === 'string' && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) ? logoUrl : undefined
        await updateProfileUseCase({
          company: {
            ...(logo != null && { logo }),
            business_type: empresaInfo.tipoNegocio?.trim() || undefined,
          },
          menu_config: {
            header_type: CONTEXT_HEADER_TO_API[tipoHeader] ?? 'classic',
            menu_type: CONTEXT_MENU_TO_API[tipoMenu] ?? 'targets_with_category',
            visualization: mostrarImagenes ? 'image' : 'text',
            view_more: mostrarVerMas ? 'yes' : 'no',
            menu_background_color: apariencia.colorFondo || undefined,
            content_background_color: apariencia.colorContenido || undefined,
            text_color: apariencia.colorTexto || undefined,
            title_color: apariencia.colorTitulo || undefined,
          },
        })
      } else if (activeTab === 'contacto') {
        await updateContactUseCase({
          whatsapp_contact: empresaInfo.whatsapp_contact?.trim() || undefined,
          visibility_whatsapp_contact: empresaInfo.visibility_whatsapp_contact,
          mail_contact: empresaInfo.mail_contact?.trim() || undefined,
          visibility_mail_contact: empresaInfo.visibility_mail_contact,
          phone_contact: empresaInfo.phone_contact?.trim() || undefined,
          visibility_phone_contact: empresaInfo.visibility_phone_contact,
          location: empresaInfo.location?.trim() || undefined,
          visibility_location: empresaInfo.visibility_location,
          schedule_visibility: empresaInfo.schedule_visibility,
          schedule: empresaInfo.schedule,
        })
      }
      await loadProfile()
    } catch (err) {
      setSaveError(err?.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (profileLoading) {
    return (
      <PageModule
        title="Editor de menú"
        description="Información de la empresa, diseño del menú y vista previa."
      >
        <div className="menu-skeleton">
          <div className="menu-layout">
            <div className="menu-editor">
              <section className="menu-editor-section menu-skeleton-section">
                <div className="skeleton-line skeleton-title" style={{ width: '60%' }} />
                <div className="config-empresa-grid" style={{ marginTop: 16 }}>
                  <div className="config-empresa-col">
                    <div className="skeleton-block skeleton-logo" />
                    <div className="skeleton-line" style={{ width: '80%', marginTop: 12 }} />
                  </div>
                  <div className="config-empresa-col">
                    <div className="skeleton-line" style={{ marginBottom: 12 }} />
                    <div className="skeleton-line" style={{ marginBottom: 12, width: '90%' }} />
                    <div className="skeleton-line" style={{ marginBottom: 12, width: '70%' }} />
                    <div className="skeleton-line" style={{ height: 60 }} />
                  </div>
                </div>
              </section>
              <section className="menu-editor-section menu-skeleton-section">
                <div className="skeleton-line skeleton-title" style={{ width: '45%' }} />
                <div className="menu-skeleton-opciones">
                  <div className="skeleton-line" style={{ width: 120, height: 32 }} />
                  <div className="skeleton-line" style={{ width: 140, height: 32 }} />
                  <div className="skeleton-line" style={{ width: 130, height: 32 }} />
                  <div className="skeleton-line" style={{ width: 110, height: 32 }} />
                </div>
              </section>
              <section className="menu-editor-section menu-skeleton-section">
                <div className="skeleton-line skeleton-title" style={{ width: '35%' }} />
                <div className="menu-skeleton-opciones">
                  <div className="skeleton-line" style={{ width: 100, height: 32 }} />
                  <div className="skeleton-line" style={{ width: 180, height: 32 }} />
                  <div className="skeleton-line" style={{ width: 160, height: 32 }} />
                  <div className="skeleton-line" style={{ width: 150, height: 32 }} />
                </div>
              </section>
              <section className="menu-editor-section menu-skeleton-section">
                <div className="skeleton-line skeleton-title" style={{ width: '50%' }} />
                <div className="menu-apariencia-grid" style={{ marginTop: 16 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="menu-apariencia-field">
                      <div className="skeleton-line" style={{ width: 80, height: 14, marginBottom: 8 }} />
                      <div className="skeleton-line" style={{ height: 40 }} />
                    </div>
                  ))}
                </div>
                <div className="skeleton-line" style={{ width: 120, height: 44, marginTop: 20 }} />
              </section>
            </div>
            <div className="menu-preview-wrap">
              <div className="skeleton-line" style={{ width: 160, height: 24, marginBottom: 16 }} />
              <div className="menu-skeleton-preview">
                <div className="skeleton-block skeleton-preview-header" />
                <div className="skeleton-line" style={{ height: 40, marginTop: 16 }} />
                <div className="skeleton-line" style={{ height: 8, marginTop: 12 }} />
                <div className="skeleton-line" style={{ height: 8, width: '70%', marginTop: 8 }} />
                <div className="skeleton-line" style={{ height: 80, marginTop: 24 }} />
                <div className="skeleton-line" style={{ height: 80, marginTop: 12 }} />
                <div className="skeleton-line" style={{ height: 80, marginTop: 12 }} />
              </div>
            </div>
          </div>
        </div>
      </PageModule>
    )
  }

  return (
    <PageModule
      title="Editor de menú"
      description="Información de la empresa, diseño del menú y vista previa. Todo lo que se muestra en el menú se configura aquí."
    >
      <form className="menu-unificado-form" onSubmit={handleSubmit}>
        {saveError && (
          <p className="form-api-error" role="alert" style={{ color: '#dc2626', fontSize: '14px', marginBottom: '12px' }}>
            {saveError}
          </p>
        )}
        <div className="menu-tabs">
          <button
            type="button"
            className={`menu-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            type="button"
            className={`menu-tab-btn ${activeTab === 'contacto' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacto')}
          >
            Contacto
          </button>
        </div>

        <div className="menu-layout">
          <div className="menu-editor">
            {activeTab === 'general' ? (
              <>
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
                          <button type="button" className="config-empresa-btn-upload" onClick={() => setShowLogoBucketBrowser(true)}>
                            <ImageIcon size={16} /> Elegir imagen
                          </button>
                          {empresaInfo.logoUrl && (
                            <button type="button" className="config-empresa-btn-remove" onClick={handleLogoRemove}>
                              <Trash2 size={16} /> Eliminar logo
                            </button>
                          )}
                        </div>
                        <p className="config-empresa-hint">Elige una imagen del bucket o sube una nueva.</p>
                        {showLogoBucketBrowser && (
                          <BucketBrowserModal
                            onSelectUrl={handleLogoSelect}
                            onClose={() => setShowLogoBucketBrowser(false)}
                          />
                        )}
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
                  <h3 className="menu-editor-title">Tipo de encabezado</h3>
                  <div className="menu-tipo-opciones">
                    {TIPOS_HEADER.map((tipo) => (
                      <label key={tipo.id} className="menu-tipo-opcion">
                        <input type="radio" name="tipoHeader" value={tipo.id} checked={tipoHeader === tipo.id} onChange={() => setTipoHeader(tipo.id)} />
                        <span>{tipo.label}</span>
                      </label>
                    ))}
                  </div>
                  {tipoHeader === 'imagen-fondo' && (
                    <div className="menu-header-imagen-wrap">
                      <div className="config-empresa-card" style={{ marginTop: 12 }}>
                        <h4 className="config-empresa-card-title">Imagen de fondo del encabezado</h4>
                        <div className="config-empresa-logo-wrap">
                          <div className="config-empresa-logo-preview config-empresa-header-fondo-preview">
                            {apariencia.imagenHeaderFondo ? (
                              <img src={apariencia.imagenHeaderFondo} alt="Fondo del encabezado" />
                            ) : (
                              <span className="config-empresa-logo-placeholder">Imagen de fondo</span>
                            )}
                          </div>
                          <input type="file" accept=".png,.jpg,.jpeg" className="config-empresa-input-file" id="header-fondo" onChange={handleHeaderFondoChange} />
                          <label htmlFor="header-fondo" className="config-empresa-btn-upload">Seleccionar imagen</label>
                          {apariencia.imagenHeaderFondo && (
                            <button type="button" className="config-empresa-btn-remove" onClick={handleHeaderFondoRemove}>
                              <Trash2 size={16} /> Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
                  <div className="menu-tipo-visual">
                    <div className="menu-tipo-visual-row">
                      <span className="menu-tipo-visual-label">Visualización:</span>
                      <div className="menu-tipo-visual-btns">
                        <button
                          type="button"
                          className={`menu-tipo-visual-btn ${!mostrarImagenes ? 'active' : ''}`}
                          onClick={() => setMostrarImagenes(false)}
                        >
                          Solo texto
                        </button>
                        <button
                          type="button"
                          className={`menu-tipo-visual-btn ${mostrarImagenes ? 'active' : ''}`}
                          onClick={() => setMostrarImagenes(true)}
                        >
                          Con imágenes
                        </button>
                      </div>
                    </div>
                    <div className="menu-tipo-visual-row">
                      <span className="menu-tipo-visual-label">Botón Ver más:</span>
                      <div className="menu-tipo-visual-btns">
                        <button
                          type="button"
                          className={`menu-tipo-visual-btn ${mostrarVerMas ? 'active' : ''}`}
                          onClick={() => setMostrarVerMas(true)}
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          className={`menu-tipo-visual-btn ${!mostrarVerMas ? 'active' : ''}`}
                          onClick={() => setMostrarVerMas(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
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
                    <button type="submit" className="config-empresa-btn-guardar" disabled={saving}>
                      <Settings size={20} aria-hidden />
                      {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </section>
              </>
            ) : (
              <section className="menu-editor-section" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
                <h3 className="menu-editor-title" style={{ marginBottom: 20 }}>Información de Contacto</h3>

                {/* REDES Y CONTACTO GRID */}
                <div className="menu-contact-grid">

                  {/* Whatsapp */}
                  <div className="menu-contact-card">
                    <div className="menu-contact-header">
                      <h4 className="menu-contact-title">
                        <MessageCircle className="menu-contact-icon" /> WhatsApp
                      </h4>
                      <label className="menu-toggle-label">
                        Visible
                        <input
                          type="checkbox"
                          style={{ display: 'none' }}
                          checked={empresaInfo.visibility_whatsapp_contact}
                          onChange={(e) => setEmpresaInfo(p => ({ ...p, visibility_whatsapp_contact: e.target.checked }))}
                        />
                        <div className="menu-toggle-switch"></div>
                      </label>
                    </div>
                    <div className="menu-contact-input-wrap">
                      <input type="text" value={empresaInfo.whatsapp_contact} onChange={(e) => setEmpresaInfo(p => ({ ...p, whatsapp_contact: e.target.value }))} placeholder="+573001234567" />
                    </div>
                  </div>

                  {/* Correo electrónico */}
                  <div className="menu-contact-card">
                    <div className="menu-contact-header">
                      <h4 className="menu-contact-title">
                        <Mail className="menu-contact-icon" /> Correo electrónico
                      </h4>
                      <label className="menu-toggle-label">
                        Visible
                        <input
                          type="checkbox"
                          style={{ display: 'none' }}
                          checked={empresaInfo.visibility_mail_contact}
                          onChange={(e) => setEmpresaInfo(p => ({ ...p, visibility_mail_contact: e.target.checked }))}
                        />
                        <div className="menu-toggle-switch"></div>
                      </label>
                    </div>
                    <div className="menu-contact-input-wrap">
                      <input type="email" value={empresaInfo.mail_contact} onChange={(e) => setEmpresaInfo(p => ({ ...p, mail_contact: e.target.value }))} placeholder="contacto@restaurante.com" />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="menu-contact-card">
                    <div className="menu-contact-header">
                      <h4 className="menu-contact-title">
                        <Phone className="menu-contact-icon" /> Teléfono Adicional
                      </h4>
                      <label className="menu-toggle-label">
                        Visible
                        <input
                          type="checkbox"
                          style={{ display: 'none' }}
                          checked={empresaInfo.visibility_phone_contact}
                          onChange={(e) => setEmpresaInfo(p => ({ ...p, visibility_phone_contact: e.target.checked }))}
                        />
                        <div className="menu-toggle-switch"></div>
                      </label>
                    </div>
                    <div className="menu-contact-input-wrap">
                      <input type="text" value={empresaInfo.phone_contact} onChange={(e) => setEmpresaInfo(p => ({ ...p, phone_contact: e.target.value }))} placeholder="(604) 123 4567" />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="menu-contact-card">
                    <div className="menu-contact-header">
                      <h4 className="menu-contact-title">
                        <MapPin className="menu-contact-icon" /> Dirección física
                      </h4>
                      <label className="menu-toggle-label">
                        Visible
                        <input
                          type="checkbox"
                          style={{ display: 'none' }}
                          checked={empresaInfo.visibility_location}
                          onChange={(e) => setEmpresaInfo(p => ({ ...p, visibility_location: e.target.checked }))}
                        />
                        <div className="menu-toggle-switch"></div>
                      </label>
                    </div>
                    <div className="menu-contact-input-wrap">
                      <input type="text" value={empresaInfo.location} onChange={(e) => setEmpresaInfo(p => ({ ...p, location: e.target.value }))} placeholder="Av. Principal #123, Ciudad" />
                    </div>
                  </div>

                </div>

                {/* HORARIOS */}
                <div className="schedule-container" style={{ marginTop: 20 }}>
                  <div className="schedule-header">
                    <h4 className="menu-contact-title" style={{ fontSize: 16 }}>
                      <CalendarDays className="menu-contact-icon" /> Horarios de atención
                    </h4>
                    <label className="menu-toggle-label">
                      Público
                      <input
                        type="checkbox"
                        style={{ display: 'none' }}
                        checked={empresaInfo.schedule_visibility}
                        onChange={(e) => setEmpresaInfo(p => ({ ...p, schedule_visibility: e.target.checked }))}
                      />
                      <div className="menu-toggle-switch"></div>
                    </label>
                  </div>

                  <div className="schedule-body">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dayName, index) => {
                      const dayData = empresaInfo.schedule?.find(s => s.day === index) || { day: index, slots: [] };
                      const hasSlots = dayData.slots.length > 0;

                      return (
                        <div key={index} className="schedule-day-row">
                          <label className="schedule-day-label menu-toggle-label">
                            <input
                              type="checkbox"
                              style={{ display: 'none' }}
                              checked={hasSlots}
                              onChange={(e) => {
                                const enabled = e.target.checked;
                                setEmpresaInfo(p => {
                                  const newSchedule = [...p.schedule];
                                  const dayIdx = newSchedule.findIndex(s => s.day === index);
                                  if (enabled) {
                                    const newDayData = { day: index, slots: [{ from: '08:00', to: '18:00' }] };
                                    if (dayIdx >= 0) newSchedule[dayIdx] = newDayData;
                                    else newSchedule.push(newDayData);
                                  } else {
                                    if (dayIdx >= 0) newSchedule[dayIdx] = { day: index, slots: [] };
                                  }
                                  return { ...p, schedule: newSchedule };
                                });
                              }}
                            />
                            <div className="menu-toggle-switch" style={{ width: 32, height: 18 }}></div>
                            <span style={{ color: hasSlots ? '#111827' : '#9ca3af' }}>{dayName}</span>
                          </label>

                          <div className="schedule-slots-wrap">
                            {!hasSlots && (
                              <span className="schedule-closed-badge">Cerrado</span>
                            )}

                            {hasSlots && dayData.slots.map((slot, slotIndex) => (
                              <div key={slotIndex} className="schedule-slot">
                                <input
                                  type="time"
                                  value={slot.from}
                                  onChange={(e) => {
                                    setEmpresaInfo(p => {
                                      const newSchedule = [...p.schedule];
                                      const d = newSchedule.find(s => s.day === index);
                                      d.slots[slotIndex].from = e.target.value;
                                      return { ...p, schedule: newSchedule };
                                    });
                                  }}
                                />
                                <span className="schedule-slot-separator">a</span>
                                <input
                                  type="time"
                                  value={slot.to}
                                  onChange={(e) => {
                                    setEmpresaInfo(p => {
                                      const newSchedule = [...p.schedule];
                                      const d = newSchedule.find(s => s.day === index);
                                      d.slots[slotIndex].to = e.target.value;
                                      return { ...p, schedule: newSchedule };
                                    });
                                  }}
                                />
                                <button
                                  type="button"
                                  className="schedule-btn-remove"
                                  onClick={() => {
                                    setEmpresaInfo(p => {
                                      const newSchedule = [...p.schedule];
                                      const d = newSchedule.find(s => s.day === index);
                                      d.slots.splice(slotIndex, 1);
                                      return { ...p, schedule: newSchedule };
                                    });
                                  }}
                                  title="Quitar tramo"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}

                            {hasSlots && (
                              <button
                                type="button"
                                className="schedule-btn-add"
                                onClick={() => {
                                  setEmpresaInfo(p => {
                                    const newSchedule = [...p.schedule];
                                    const d = newSchedule.find(s => s.day === index);
                                    d.slots.push({ from: '15:00', to: '20:00' });
                                    return { ...p, schedule: newSchedule };
                                  });
                                }}
                              >
                                <Plus size={14} /> Añadir horario
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="menu-form-actions" style={{ marginTop: '24px' }}>
                  <button type="submit" className="config-empresa-btn-guardar" disabled={saving}>
                    <Settings size={20} aria-hidden />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </section>
            )}
          </div>
          <div className="menu-preview-wrap">
            <div className="menu-preview-header-actions">
              <h3 className="menu-preview-label">
                {activeTab === 'contacto' ? 'Vista previa de Contacto' : 'Vista previa del menú'}
              </h3>
              <Link to="/app/menu/vista-completa" className="btn-secondary menu-preview-btn" target="_blank" rel="noopener noreferrer">
                Ver menú completo
              </Link>
            </div>
            {activeTab === 'contacto' ? (
              <div
                className="menu-preview-contacto-wrapper"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  backgroundColor: apariencia?.colorFondo || '#f8f9fa',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 220,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: apariencia?.colorTexto || '#9ca3af',
                    fontSize: 13,
                    padding: '32px 24px',
                    textAlign: 'center',
                    opacity: 0.55,
                  }}
                >
                  ··· contenido del menú ···
                </div>
                <MenuContactBar empresaInfo={empresaInfo} apariencia={apariencia} />
              </div>
            ) : (
              <MenuPreview categorias={categoriasConProductos} apariencia={apariencia} tipoMenu={tipoMenu} empresaInfo={empresaInfo} mostrarImagenes={mostrarImagenes} mostrarVerMas={mostrarVerMas} tipoHeader={tipoHeader} />
            )}
          </div>
        </div>
      </form>
    </PageModule>
  )
}
