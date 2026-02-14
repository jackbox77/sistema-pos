import { useState } from 'react'
import PageModule from '../../components/PageModule/PageModule'
import './Perfil.css'

const TABS = [
  { id: 'perfil', label: 'PERFIL' },
  { id: 'apikey', label: 'API KEY' },
]

export default function Perfil() {
  const [tabActiva, setTabActiva] = useState('perfil')

  return (
    <PageModule
      title="Perfil"
      description="Datos de la empresa y configuración de integraciones. Gestiona el perfil y las claves API."
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
        {tabActiva === 'perfil' && (
          <section className="perfil-section">
            <form className="config-form" onSubmit={(e) => e.preventDefault()}>
              <h3 className="perfil-section-title">Datos de la empresa</h3>
              <div className="config-form-grid">
                <div className="config-field">
                  <label>Nombre de la empresa</label>
                  <input type="text" placeholder="Nombre de la empresa" />
                </div>
                <div className="config-field">
                  <label>Tipo de identificación</label>
                  <select>
                    <option value="">Seleccione</option>
                    <option value="nit">NIT</option>
                    <option value="cc">Cédula de ciudadanía</option>
                    <option value="ce">Cédula de extranjería</option>
                    <option value="pasaporte">Pasaporte</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="config-field">
                  <label>Número de identificación</label>
                  <input type="text" placeholder="Número de identificación" />
                </div>
                <div className="config-field">
                  <label>Dirección</label>
                  <input type="text" placeholder="Dirección fiscal" />
                </div>
                <div className="config-field">
                  <label>Ciudad</label>
                  <input type="text" placeholder="Ciudad" />
                </div>
                <div className="config-field">
                  <label>Teléfono</label>
                  <input type="tel" placeholder="Teléfono de contacto" />
                </div>
                <div className="config-field">
                  <label>Correo de la empresa</label>
                  <input type="email" placeholder="Correo electrónico de la empresa" />
                </div>
                <div className="config-field">
                  <label>Sitio web</label>
                  <input type="url" placeholder="https://www.ejemplo.com" />
                </div>
                <div className="config-field" style={{ gridColumn: '1 / -1' }}>
                  <label>Representante legal</label>
                  <input type="text" placeholder="Nombre del representante" />
                </div>
              </div>
              <div className="config-form-actions">
                <button type="submit" className="btn-primary">Guardar cambios</button>
              </div>
            </form>
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
                    type="password"
                    className="perfil-apikey-input"
                    value="••••••••••••••••••••••••••••••••"
                    readOnly
                  />
                  <button type="button" className="btn-secondary perfil-apikey-btn">Mostrar</button>
                </div>
              </div>
              <div className="config-field" style={{ gridColumn: '1 / -1' }}>
                <button type="button" className="btn-secondary">Regenerar clave API</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageModule>
  )
}
