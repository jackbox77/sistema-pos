import { useState, useEffect, useCallback } from 'react'
import { X, Info } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'
import {
  getTaxesUseCase,
  createTaxUseCase,
  updateTaxUseCase,
} from '../../feature/masters/taxes/use-case'

function normalizarCodigo(s) {
  return (s ?? '').toString().trim().replace(/\s+/g, '-').toUpperCase()
}

/** Parsea porcentaje de UI ("19%" o "19") a número para la API */
function parsePorcentaje(val) {
  if (typeof val === 'number' && !Number.isNaN(val)) return val
  const s = String(val ?? '').replace(/%/g, '').trim()
  const n = Number(s)
  return Number.isNaN(n) ? 0 : n
}

function mapTaxApiToUI(t) {
  return {
    id: t.id,
    codigo: t.code ?? '',
    nombre: t.name ?? '',
    porcentaje: `${t.percentage ?? 0}%`,
    descripcion: t.description ?? '',
    estado: t.status === 'active' ? 'Activo' : 'Inactivo',
  }
}

export default function Impuestos() {
  const [impuestos, setImpuestos] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingEstadoId, setUpdatingEstadoId] = useState(null)
  const [error, setError] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos' }])
  const [showInfoSoporte, setShowInfoSoporte] = useState(false)

  const cargarImpuestos = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await getTaxesUseCase(1, 200)
      if (res?.success && res?.data?.data) {
        setImpuestos(res.data.data.map(mapTaxApiToUI))
      } else {
        setImpuestos([])
      }
    } catch (err) {
      setError(err?.message ?? 'Error al cargar impuestos')
      setImpuestos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarImpuestos()
  }, [cargarImpuestos])

  const cambiarEstado = async (imp) => {
    const newStatus = imp.estado === 'Activo' ? 'inactive' : 'active'
    setError(null)
    setUpdatingEstadoId(imp.id)
    try {
      const res = await updateTaxUseCase(
        imp.id,
        imp.codigo,
        imp.nombre,
        parsePorcentaje(imp.porcentaje),
        imp.descripcion ?? '',
        newStatus
      )
      if (res?.success) await cargarImpuestos()
      else setError(res?.message ?? 'Error al cambiar estado')
    } catch (err) {
      setError(err?.message ?? 'Error al cambiar estado')
    } finally {
      setUpdatingEstadoId(null)
    }
  }

  const handleCrear = () => setShowFormModal(true)
  const cerrarFormModal = () => setShowFormModal(false)

  const quitarFiltro = (id) => {
    setFiltrosActivos((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Impuestos</h1>
            <p className="maestro-encabezado-desc">
              Creación y edición de impuestos.
            </p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <button type="button" className="btn-primary" onClick={handleCrear}>
              + Nuevo impuesto
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
        <input type="search" className="input-search" placeholder="Buscar impuestos..." style={{ flex: '1', minWidth: '200px' }} />
        <button
          type="button"
          onClick={() => setShowInfoSoporte(true)}
          style={{ background: 'transparent', color: '#dc2626', border: 'none', width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}
          title="Para editar o eliminar impuestos, comuníquese con soporte"
          aria-label="Información sobre edición y eliminación"
        >
          <Info size={22} strokeWidth={2.5} />
        </button>
      </div>
      {showInfoSoporte && (
        <div className="form-overlay" onClick={() => setShowInfoSoporte(false)} role="dialog" aria-modal="true" aria-labelledby="info-soporte-impuestos">
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <div className="form-header">
              <h3 id="info-soporte-impuestos">Información</h3>
              <button className="form-close" onClick={() => setShowInfoSoporte(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className="form-body">
              <p style={{ margin: 0, color: '#374151' }}>
                Para editar o eliminar impuestos debe comunicarse con soporte.
              </p>
              <div className="form-footer" style={{ marginTop: '1rem' }}>
                <button type="button" className="form-btn-primary" onClick={() => setShowInfoSoporte(false)}>Entendido</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <p className="page-module-empty" style={{ color: '#dc2626', marginBottom: '12px' }}>
          {error}
        </p>
      )}
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Porcentaje</th>
              <th>Descripción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {impuestos.length === 0 && loading ? (
              <tr>
                <td data-label="Código">—</td>
                <td data-label="Nombre">—</td>
                <td data-label="Porcentaje">—</td>
                <td data-label="Descripción">—</td>
                <td data-label="Estado">
                  <span className="badge badge-estado-toggle" aria-busy="true">Cargando</span>
                </td>
              </tr>
            ) : (
              impuestos.map((imp) => (
                <tr key={imp.id}>
                  <td data-label="Código">{normalizarCodigo(imp.codigo)}</td>
                  <td data-label="Nombre">{imp.nombre}</td>
                  <td data-label="Porcentaje">{imp.porcentaje}</td>
                  <td data-label="Descripción">{imp.descripcion}</td>
                  <td data-label="Estado">
                    {updatingEstadoId === imp.id ? (
                      <span className="badge badge-estado-toggle" aria-busy="true">Cargando</span>
                    ) : (
                      <button
                        type="button"
                        className={`badge badge-estado-toggle ${imp.estado === 'Activo' ? 'badge-success' : 'badge-inactive'}`}
                        onClick={() => cambiarEstado(imp)}
                        title="Clic para cambiar estado"
                      >
                        {imp.estado}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>

      {showFormModal && (
        <ModalFormImpuesto
          impuesto={null}
          onClose={cerrarFormModal}
          onGuardar={async (code, name, percentage, description, status) => {
            setError(null)
            try {
              const res = await createTaxUseCase(code, name, percentage, description, status)
              if (res?.success) {
                await cargarImpuestos()
                cerrarFormModal()
              } else {
                setError(res?.message ?? 'Error al crear')
              }
            } catch (err) {
              setError(err?.message ?? 'Error al guardar')
            }
          }}
          esEdicion={false}
        />
      )}
    </PageModule>
  )
}

function ModalFormImpuesto({ impuesto, onClose, onGuardar, esEdicion = false }) {
  const [codigo, setCodigo] = useState(impuesto?.codigo ?? '')
  const [nombre, setNombre] = useState(impuesto?.nombre ?? '')
  const [porcentaje, setPorcentaje] = useState(impuesto?.porcentaje ?? '0%')
  const [descripcion, setDescripcion] = useState(impuesto?.descripcion ?? '')
  const [estado, setEstado] = useState(impuesto?.estado ?? 'Activo')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onGuardar(
        normalizarCodigo(codigo),
        nombre.trim(),
        parsePorcentaje(porcentaje),
        descripcion.trim(),
        estado === 'Activo' ? 'active' : 'inactive'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>{esEdicion ? 'Editar impuesto' : 'Nuevo impuesto'}</h3>
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
                placeholder="Ej: IVA-19"
                required
              />
            </div>
            <div className="config-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del impuesto"
                required
              />
            </div>
            <div className="config-field">
              <label>Porcentaje *</label>
              <input
                type="text"
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                placeholder="Ej: 19% o 0%"
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
              {saving ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear impuesto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
