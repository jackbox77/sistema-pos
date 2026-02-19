import { useState, useEffect, useCallback } from 'react'
import PageModule from '../../components/PageModule/PageModule'
import { getCompanyUseCase, updateCompanyUseCase } from '../../feature/configuration/company/use-case'
import { getApiKeysUseCase, regenerateApiKeyUseCase } from '../../feature/configuration/api-keys/use-case'
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

export default function Compania() {
  const [tabActiva, setTabActiva] = useState('compania')
  const [companyLoading, setCompanyLoading] = useState(true)
  const [companyError, setCompanyError] = useState(null)
  const [companySaving, setCompanySaving] = useState(false)
  const [form, setForm] = useState({
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

  const cargarCompany = useCallback(async () => {
    setCompanyError(null)
    setCompanyLoading(true)
    try {
      const res = await getCompanyUseCase()
      if (res?.success && res?.data) {
        const d = res.data
        setForm({
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
