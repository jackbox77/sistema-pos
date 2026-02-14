import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProveedores, TIPOS_DOCUMENTO } from './ProveedoresLayout'
import PageModule from '../../components/PageModule/PageModule'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function ProveedorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregarProveedor, actualizarProveedor, obtenerProveedor } = useProveedores()
  const esEdicion = Boolean(id)

  const [tipoDocumento, setTipoDocumento] = useState('NIT')
  const [numeroDocumento, setNumeroDocumento] = useState('')
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [telefono, setTelefono] = useState('')

  useEffect(() => {
    if (esEdicion && id) {
      const p = obtenerProveedor(id)
      if (p) {
        setTipoDocumento(p.tipoDocumento ?? (p.nit ? 'NIT' : 'NIT'))
        setNumeroDocumento(p.numeroDocumento ?? p.nit ?? '')
        setNombre(p.nombre ?? '')
        setContacto(p.contacto ?? '')
        setTelefono(p.telefono ?? '')
      }
    }
  }, [id, esEdicion, obtenerProveedor])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { tipoDocumento, numeroDocumento, nombre, contacto, telefono }
    if (esEdicion) {
      actualizarProveedor(id, data)
    } else {
      agregarProveedor(data)
    }
    navigate('/app/maestros/proveedores')
  }

  return (
    <PageModule
      title={esEdicion ? 'Editar proveedor' : 'Nuevo proveedor'}
      description={esEdicion ? 'Modifica los datos del proveedor.' : 'Registra un nuevo proveedor.'}
    >
      <form onSubmit={handleSubmit} className="config-form">
        <div className="config-form-grid">
          <div className="config-field">
            <label>Tipo de documento</label>
            <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="config-field">
            <label>Número de documento</label>
            <input
              type="text"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              placeholder="Ej: 900.123.456-1 o número de cédula"
            />
          </div>
          <div className="config-field">
            <label>Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Razón social o nombre del proveedor"
              required
            />
          </div>
          <div className="config-field">
            <label>Contacto</label>
            <input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              placeholder="Nombre del contacto"
            />
          </div>
          <div className="config-field">
            <label>Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 300 123 4567"
            />
          </div>
        </div>
        <div className="config-form-actions" style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/app/maestros/proveedores')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {esEdicion ? 'Guardar cambios' : 'Crear proveedor'}
          </button>
        </div>
      </form>
    </PageModule>
  )
}
