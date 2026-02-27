import { useState, useEffect, useCallback, useRef, useMemo, Fragment } from 'react'
import { FolderOpen, ChevronRight, Plus, Upload, ImageIcon, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import { getCompanyUseCase, updateCompanyUseCase } from '../../feature/configuration/company/use-case'
import { getApiKeysUseCase, regenerateApiKeyUseCase } from '../../feature/configuration/api-keys/use-case'
import { validateBucketUseCase, getBucketUseCase, createBucketUseCase, createFolderUseCase, uploadFileUseCase } from '../../feature/storage/use-case'
import '../../components/FormularioProductos/FormularioProductos.css'
import './Perfil.css'

const TABS = [
  { id: 'compania', label: 'COMPAÑÍA' },
  { id: 'apikey', label: 'API KEY' },
]

const MASKED = '••••••••••••••••••••••••••••••••'

const TIPOS_IDENTIFICACION = [
  { value: 'NIT', label: 'NIT' },
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'OTHER', label: 'Otro' },
]

const TIPOS_NEGOCIO = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'tienda', label: 'Tienda' },
  { value: 'cafe', label: 'Café' },
  { value: 'bar', label: 'Bar' },
  { value: 'supermercado', label: 'Supermercado' },
  { value: 'otros', label: 'Otros' },
]

export default function Compania() {
  const [tabActiva, setTabActiva] = useState('compania')
  const [companyLoading, setCompanyLoading] = useState(true)
  const [companyError, setCompanyError] = useState(null)
  const [companySaving, setCompanySaving] = useState(false)
  const [form, setForm] = useState({
    logo: '',
    business_type: '',
    name: '',
    identification_type: 'NIT',
    identification_number: '',
    address: '',
    phone: '',
    email: '',
    legal_representative_name: '',
    status: 'active',
  })
  const [apiKeys, setApiKeys] = useState([])
  const [apiKeyLoading, setApiKeyLoading] = useState(false)
  const [apiKeyRegenerating, setApiKeyRegenerating] = useState(false)
  const [showApiKeyValue, setShowApiKeyValue] = useState(false)
  const [showBucketBrowser, setShowBucketBrowser] = useState(false)

  const cargarCompany = useCallback(async () => {
    setCompanyError(null)
    setCompanyLoading(true)
    try {
      const res = await getCompanyUseCase()
      if (res?.success && res?.data) {
        const d = res.data
        setForm({
          logo: d.logo ?? '',
          business_type: d.business_type ?? '',
          name: d.name ?? '',
          identification_type: d.identification_type ?? 'NIT',
          identification_number: d.identification_number ?? '',
          address: d.address ?? '',
          phone: d.phone ?? '',
          email: d.email ?? '',
          legal_representative_name: d.legal_representative_name ?? '',
          status: d.status ?? 'active',
        })
      }
    } catch (err) {
      setCompanyError(err?.message ?? 'Error al cargar datos de la empresa')
    } finally {
      setCompanyLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tabActiva === 'compania') cargarCompany()
  }, [tabActiva, cargarCompany])

  const handleCompanyChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCompanySubmit = async (e) => {
    e.preventDefault()
    setCompanyError(null)
    setCompanySaving(true)
    try {
      const res = await updateCompanyUseCase({
        logo: form.logo.trim() || undefined,
        business_type: form.business_type || undefined,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        identification_type: form.identification_type,
        identification_number: form.identification_number.trim(),
        address: form.address.trim(),
        legal_representative_name: form.legal_representative_name.trim(),
        status: form.status,
      })
      if (res?.success) {
        await cargarCompany()
      } else {
        setCompanyError(res?.message ?? 'Error al guardar')
      }
    } catch (err) {
      setCompanyError(err?.message ?? 'Error al guardar')
    } finally {
      setCompanySaving(false)
    }
  }

  const cargarApiKeys = useCallback(async () => {
    setApiKeyLoading(true)
    try {
      const res = await getApiKeysUseCase(1, 10)
      if (res?.success && res?.data?.data) setApiKeys(res.data.data)
      else setApiKeys([])
    } catch {
      setApiKeys([])
    } finally {
      setApiKeyLoading(false)
    }
  }, [])

  useEffect(() => {
    if (tabActiva === 'apikey') cargarApiKeys()
  }, [tabActiva, cargarApiKeys])

  const handleRegenerar = async () => {
    setApiKeyRegenerating(true)
    try {
      await regenerateApiKeyUseCase()
      await cargarApiKeys()
    } finally {
      setApiKeyRegenerating(false)
    }
  }

  const primeraClave = apiKeys[0]
  const valorClave = showApiKeyValue ? (primeraClave?.api_brevo ?? '') : MASKED

  return (
    <PageModule
      title="Compañía"
      description="Datos de la empresa y configuración de integraciones. Gestiona la compañía y las claves API."
    >
      <div className="perfil-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`perfil-tab ${tabActiva === tab.id ? 'active' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="perfil-content">
        {tabActiva === 'compania' && (
          <section className="perfil-section">
            {companyError && (
              <p className="page-module-empty" style={{ color: '#dc2626', marginBottom: '12px' }}>
                {companyError}
              </p>
            )}
            {companyLoading ? (
              <p className="perfil-section-desc">Cargando datos de la empresa...</p>
            ) : (
              <form className="config-form" onSubmit={handleCompanySubmit}>
                <h3 className="perfil-section-title">Datos de la empresa</h3>
                <div className="config-form-grid">
                  <div className="config-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Logo de la empresa</label>
                    {form.logo && (
                      <div className="config-field-preview" style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                        <img src={form.logo} alt="Logo" style={{ maxHeight: 60, maxWidth: 160, objectFit: 'contain', background: '#e5e7eb', padding: '4px', borderRadius: '4px' }} onError={(e) => { e.target.style.display = 'none' }} />
                        <button type="button" className="btn-secondary" onClick={() => handleCompanyChange('logo', '')} style={{ padding: '4px 8px', fontSize: '13px' }}>
                          Quitar logo
                        </button>
                      </div>
                    )}
                    <button type="button" className="btn-secondary" onClick={() => setShowBucketBrowser(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                      <ImageIcon size={18} /> {form.logo ? 'Cambiar logo' : 'Elegir logo'}
                    </button>
                    {showBucketBrowser && (
                      <BucketBrowserModal
                        onSelectUrl={(url) => {
                          handleCompanyChange('logo', url)
                          setShowBucketBrowser(false)
                        }}
                        onClose={() => setShowBucketBrowser(false)}
                      />
                    )}
                  </div>
                  <div className="config-field">
                    <label>Tipo de negocio</label>
                    <select
                      value={form.business_type}
                      onChange={(e) => handleCompanyChange('business_type', e.target.value)}
                    >
                      <option value="">Seleccione</option>
                      {TIPOS_NEGOCIO.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="config-field">
                    <label>Nombre de la empresa</label>
                    <input
                      type="text"
                      placeholder="Nombre de la empresa"
                      value={form.name}
                      onChange={(e) => handleCompanyChange('name', e.target.value)}
                    />
                  </div>
                  <div className="config-field">
                    <label>Tipo de identificación</label>
                    <select
                      value={form.identification_type}
                      onChange={(e) => handleCompanyChange('identification_type', e.target.value)}
                    >
                      {TIPOS_IDENTIFICACION.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="config-field">
                    <label>Número de identificación</label>
                    <input
                      type="text"
                      placeholder="Número de identificación"
                      value={form.identification_number}
                      onChange={(e) => handleCompanyChange('identification_number', e.target.value)}
                    />
                  </div>
                  <div className="config-field">
                    <label>Dirección</label>
                    <input
                      type="text"
                      placeholder="Dirección fiscal"
                      value={form.address}
                      onChange={(e) => handleCompanyChange('address', e.target.value)}
                    />
                  </div>
                  <div className="config-field">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      placeholder="Teléfono de contacto"
                      value={form.phone}
                      onChange={(e) => handleCompanyChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="config-field">
                    <label>Correo de la empresa</label>
                    <input
                      type="email"
                      placeholder="Correo electrónico de la empresa"
                      value={form.email}
                      onChange={(e) => handleCompanyChange('email', e.target.value)}
                    />
                  </div>
                  <div className="config-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Representante legal</label>
                    <input
                      type="text"
                      placeholder="Nombre del representante"
                      value={form.legal_representative_name}
                      onChange={(e) => handleCompanyChange('legal_representative_name', e.target.value)}
                    />
                  </div>
                </div>
                <div className="config-form-actions">
                  <button type="submit" className="btn-primary" disabled={companySaving}>
                    {companySaving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {tabActiva === 'apikey' && (
          <section className="perfil-section">
            <h3 className="perfil-section-title">Clave API</h3>
            <p className="perfil-section-desc">
              Usa tu clave API para integrar el sistema POS con otras aplicaciones, pasarelas de pago o servicios externos.
              No compartas tu clave con terceros.
            </p>
            <div className="config-form-grid" style={{ maxWidth: '560px' }}>
              <div className="config-field" style={{ gridColumn: '1 / -1' }}>
                <label>Clave API (solo lectura)</label>
                <div className="perfil-apikey-wrap">
                  <input
                    type={showApiKeyValue ? 'text' : 'password'}
                    className="perfil-apikey-input"
                    value={apiKeyLoading ? 'Cargando' : valorClave}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn-secondary perfil-apikey-btn"
                    onClick={() => setShowApiKeyValue((v) => !v)}
                  >
                    {showApiKeyValue ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
              <div className="config-field" style={{ gridColumn: '1 / -1' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={apiKeyRegenerating}
                  onClick={handleRegenerar}
                >
                  {apiKeyRegenerating ? 'Regenerando...' : 'Regenerar clave API'}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageModule>
  )
}

/** Obtiene el nodo actual del árbol según la ruta de carpetas */
function getBucketCurrentNode(treeData, path) {
  const root = treeData?.data?.tree?.folders ?? {}
  if (path.length === 0) return { folders: root, images: [] }
  const node = path.reduce((n, name) => n?.folders?.[name], { folders: root })
  return node ?? { folders: {}, images: [] }
}

function BucketBrowserModal({ onSelectUrl, onClose }) {
  const [tree, setTree] = useState(null)
  const [currentPath, setCurrentPath] = useState(['general'])
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
                          placeholder="Nombre de carpeta"
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
