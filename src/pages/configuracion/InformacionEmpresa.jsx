import PageModule from '../../components/PageModule/PageModule'

export default function InformacionEmpresa() {
  return (
    <PageModule
      title="Información de la empresa"
      description="Datos fiscales y de identificación de tu negocio."
    >
      <form className="config-form">
        <div className="config-form-grid">
          <div className="config-field">
            <label>Razón social</label>
            <input type="text" placeholder="Nombre de la empresa" />
          </div>
          <div className="config-field">
            <label>NIT / Identificación</label>
            <input type="text" placeholder="Número de identificación" />
          </div>
          <div className="config-field">
            <label>Dirección</label>
            <input type="text" placeholder="Dirección fiscal" />
          </div>
          <div className="config-field">
            <label>Teléfono</label>
            <input type="tel" placeholder="Teléfono de contacto" />
          </div>
          <div className="config-field">
            <label>Email</label>
            <input type="email" placeholder="Correo electrónico" />
          </div>
          <div className="config-field">
            <label>Ciudad</label>
            <input type="text" placeholder="Ciudad" />
          </div>
        </div>
        <div className="config-form-actions">
          <button type="submit" className="btn-primary">Guardar cambios</button>
        </div>
      </form>
    </PageModule>
  )
}
