import { useState, useEffect, useCallback } from 'react'
import { X, Info } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'
import {
  getPaymentMethodsUseCase,
  createPaymentMethodUseCase,
  updatePaymentMethodUseCase,
} from '../../feature/masters/payment-methods/use-case'

function normalizarCodigo(s) {
  return (s ?? '').toString().trim().replace(/\s+/g, '-').toUpperCase()
}

function mapApiToUI(m) {
  return {
    id: m.id,
    codigo: m.code ?? '',
    nombre: m.method_name ?? '',
    descripcion: m.description ?? '',
    estado: m.status === 'active' ? 'Activo' : 'Inactivo',
  }
}

function mapFormToApi(data) {
  return {
    code: data.codigo ?? '',
    method_name: data.nombre ?? '',
    description: data.descripcion ?? '',
    status: data.estado === 'Activo' ? 'active' : 'inactive',
  }
}

export default function MetodosPago() {
  const [metodos, setMetodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingEstadoId, setUpdatingEstadoId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos' }])
  const [showInfoSoporte, setShowInfoSoporte] = useState(false)

  const cargarMetodos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getPaymentMethodsUseCase(1, 100)
      const list = res?.data?.data ?? res?.data ?? (Array.isArray(res) ? res : [])
      setMetodos(Array.isArray(list) ? list.map(mapApiToUI) : [])
    } catch {
      setMetodos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarMetodos()
  }, [cargarMetodos])

  const quitarFiltro = (id) => {
    setFiltrosActivos((prev) => prev.filter((f) => f.id !== id))
  }

  const cambiarEstado = async (m) => {
    const nuevoEstado = m.estado === 'Activo' ? 'inactive' : 'active'
    setUpdatingEstadoId(m.id)
    try {
      await updatePaymentMethodUseCase(m.id, {
        code: m.codigo,
        method_name: m.nombre,
        description: m.descripcion,
        status: nuevoEstado,
      })
      await cargarMetodos()
    } catch (_) {}
    finally {
      setUpdatingEstadoId(null)
    }
  }

  const handleCrear = () => setShowCreateModal(true)

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Métodos de pago</h1>
            <p className="maestro-encabezado-desc">
              Creación y edición de métodos de pago. Active o desactive cada método según disponibilidad.
            </p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <button type="button" className="btn-primary" onClick={handleCrear}>
              + Nuevo método de pago
            </button>
          </div>
        </div>
        <div className="maestro-encabezado-filtros">
          <div className="maestro-encabezado-filtros-left">
            <label className="maestro-encabezado-label">Lista de precios</label>
            <select
              className="maestro-encabezado-select"
              value={listaPrecios}
              onChange={(e) => setListaPrecios(e.target.value)}
            >
              <option value="general">General</option>
              <option value="mayorista">Mayorista</option>
              <option value="especial">Especial</option>
            </select>
          </div>
          <div className="maestro-encabezado-filtros-right">
            <span className="maestro-encabezado-label">Filtros Activos:</span>
            {filtrosActivos.length > 0 ? (
              filtrosActivos.map((f) => (
                <span key={f.id} className="maestro-filtro-tag">
                  {f.label}
                  <button type="button" onClick={() => quitarFiltro(f.id)} aria-label="Quitar filtro">
                    <X size={14} />
                  </button>
                </span>
              ))
            ) : (
              <span className="maestro-filtro-sin">Ninguno</span>
            )}
          </div>
        </div>
      </header>
      <div className="page-module-toolbar" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <input type="search" className="input-search" placeholder="Buscar métodos de pago..." style={{ flex: '1', minWidth: '200px' }} />
        <button
          type="button"
          onClick={() => setShowInfoSoporte(true)}
          style={{ background: 'transparent', color: '#dc2626', border: 'none', width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}
          title="Para editar o eliminar métodos de pago, comuníquese con soporte"
          aria-label="Información sobre edición y eliminación"
        >
          <Info size={22} strokeWidth={2.5} />
        </button>
      </div>
      {showInfoSoporte && (
        <div className="form-overlay" onClick={() => setShowInfoSoporte(false)} role="dialog" aria-modal="true" aria-labelledby="info-soporte-metodos">
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <div className="form-header">
              <h3 id="info-soporte-metodos">Información</h3>
              <button className="form-close" onClick={() => setShowInfoSoporte(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className="form-body">
              <p style={{ margin: 0, color: '#374151' }}>
                Para editar o eliminar métodos de pago debe comunicarse con soporte.
              </p>
              <div className="form-footer" style={{ marginTop: '1rem' }}>
                <button type="button" className="form-btn-primary" onClick={() => setShowInfoSoporte(false)}>Entendido</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Método de pago</th>
              <th>Descripción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {metodos.length === 0 && loading ? (
              <tr>
                <td data-label="Código">—</td>
                <td data-label="Método de pago">—</td>
                <td data-label="Descripción">—</td>
                <td data-label="Estado">
                  <span className="badge badge-estado-toggle" aria-busy="true">Cargando</span>
                </td>
              </tr>
            ) : (
              metodos.map((m) => (
                <tr key={m.id}>
                  <td data-label="Código">{normalizarCodigo(m.codigo)}</td>
                  <td data-label="Método de pago">{m.nombre}</td>
                  <td data-label="Descripción">{m.descripcion}</td>
                  <td data-label="Estado">
                    {updatingEstadoId === m.id ? (
                      <span className="badge badge-estado-toggle" aria-busy="true">Cargando</span>
                    ) : (
                      <button
                        type="button"
                        className={`badge badge-estado-toggle ${m.estado === 'Activo' ? 'badge-success' : 'badge-inactive'}`}
                        onClick={() => cambiarEstado(m)}
                        title="Clic para cambiar estado"
                      >
                        {m.estado}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>

      {showCreateModal && (
        <ModalFormMetodoPago
          onClose={() => setShowCreateModal(false)}
          onGuardar={async (data) => {
            try {
              await createPaymentMethodUseCase(mapFormToApi(data))
              await cargarMetodos()
              setShowCreateModal(false)
            } catch (_) {}
          }}
        />
      )}
    </PageModule>
  )
}

function ModalFormMetodoPago({ metodo, onClose, onGuardar, esEdicion = false }) {
  const [codigo, setCodigo] = useState(metodo?.codigo ?? '')
  const [nombre, setNombre] = useState(metodo?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(metodo?.descripcion ?? '')
  const [estado, setEstado] = useState(metodo?.estado ?? 'Activo')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onGuardar({ codigo: normalizarCodigo(codigo), nombre, descripcion, estado })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar método de pago' : 'Nuevo método de pago'}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="config-field">
              <label>Código *</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: EF, TD, TC"
                required
              />
            </div>
            <div className="config-field">
              <label>Método de pago *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Efectivo, Tarjeta débito"
                required
              />
            </div>
            <div className="config-field">
              <label>Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción opcional"
                rows={3}
              />
            </div>
            <div className="config-field">
              <label>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="form-btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear método de pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
