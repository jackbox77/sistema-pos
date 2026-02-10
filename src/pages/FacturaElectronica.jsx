import PageModule from '../components/PageModule/PageModule'

export default function FacturaElectronica() {
  return (
    <PageModule
      title="Habilitar factura electrónica"
      description="Configura los datos necesarios para emitir facturas electrónicas según la normativa vigente."
    >
      <form className="config-form">
        <div className="config-form-grid">
          <div className="config-field">
            <label>Software de facturación electrónica</label>
            <select>
              <option>Seleccionar proveedor</option>
            </select>
          </div>
          <div className="config-field">
            <label>Certificado digital</label>
            <input type="file" accept=".p12,.pfx" />
          </div>
          <div className="config-field">
            <label>Contraseña del certificado</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="config-field">
            <label>Ambiente (pruebas/producción)</label>
            <select>
              <option>Pruebas</option>
              <option>Producción</option>
            </select>
          </div>
        </div>
        <div className="config-form-actions">
          <button type="submit" className="btn-primary">Guardar configuración</button>
        </div>
      </form>
    </PageModule>
  )
}
