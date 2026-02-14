import { useRef, useState, useEffect } from 'react'
import { Pencil, Trash2, Upload, Download, ChevronDown, X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

const impuestosIniciales = [
  { id: 1, codigo: 'IVA-19', nombre: 'IVA', porcentaje: '19%', descripcion: 'Impuesto al valor agregado', estado: 'Activo' },
  { id: 2, codigo: 'IVA-0', nombre: 'Exento', porcentaje: '0%', descripcion: 'Productos exentos de IVA', estado: 'Inactivo' },
]

export default function Impuestos() {
  const [impuestos, setImpuestos] = useState(impuestosIniciales)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [impuestoEditando, setImpuestoEditando] = useState(null)
  const [impuestoEliminar, setImpuestoEliminar] = useState(null)

  const cambiarEstado = (id) => {
    setImpuestos((prev) =>
      prev.map((imp) =>
        imp.id === id
          ? { ...imp, estado: imp.estado === 'Activo' ? 'Inactivo' : 'Activo' }
          : imp
      )
    )
  }

  const handleCrear = () => setShowCreateModal(true)
  const handleEditar = (imp) => {
    setImpuestoEditando(imp)
    setShowEditModal(true)
  }
  const handleEliminar = (imp) => {
    setImpuestoEliminar(imp)
    setShowDeleteModal(true)
  }
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const inputCargaRef = useRef(null)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: activos' }])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (masAccionesRef.current && !masAccionesRef.current.contains(e.target)) setShowMasAcciones(false)
    }
    if (showMasAcciones) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMasAcciones])
  const descargarPlantillaImpuestos = () => {
    descargarPlantilla(
      ['codigo', 'nombre', 'porcentaje', 'descripcion', 'estado'],
      ['IVA-5', 'IVA Reducido', '5%', 'Productos de la canasta familiar', 'Activo'],
      'plantilla_impuestos.csv'
    )
  }
  const handleCargaMasiva = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const filas = parsearCSV(reader.result)
      if (filas.length < 2) return
      const [, ...datos] = filas
      const nuevos = datos
        .filter((f) => f[0]?.trim())
        .map((f) => ({
          id: Date.now() + Math.random(),
          codigo: (f[0] ?? '').trim(),
          nombre: (f[1] ?? '').trim(),
          porcentaje: (f[2] ?? '0%').trim(),
          descripcion: (f[3] ?? '').trim(),
          estado: (f[4] ?? 'Activo').trim() === 'Inactivo' ? 'Inactivo' : 'Activo',
        }))
      setImpuestos((prev) => [...prev, ...nuevos])
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

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
            <div className="toolbar-mas-acciones-wrap" ref={masAccionesRef}>
              <button
                type="button"
                className="toolbar-mas-acciones"
                onClick={() => setShowMasAcciones((v) => !v)}
                aria-expanded={showMasAcciones}
                aria-haspopup="true"
              >
                Más acciones <ChevronDown size={18} />
              </button>
              {showMasAcciones && (
                <div className="toolbar-dropdown">
                  <button type="button" onClick={() => { descargarPlantillaImpuestos(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar plantilla
                  </button>
                  <button type="button" onClick={() => { inputCargaRef.current?.click(); setShowMasAcciones(false); }}>
                    <Upload size={18} /> Carga masiva
                  </button>
                </div>
              )}
            </div>
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
      <input
        ref={inputCargaRef}
        type="file"
        accept=".csv"
        className="input-file"
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
        onChange={handleCargaMasiva}
      />
      <div className="page-module-toolbar" style={{ marginTop: '16px' }}>
        <input type="search" className="input-search" placeholder="Buscar impuestos..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Porcentaje</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {impuestos.map((imp) => (
              <tr key={imp.id}>
                <td data-label="Código">{imp.codigo}</td>
                <td data-label="Nombre">{imp.nombre}</td>
                <td data-label="Porcentaje">{imp.porcentaje}</td>
                <td data-label="Descripción">{imp.descripcion}</td>
                <td data-label="Estado">
                  <button
                    type="button"
                    className={`badge badge-estado-toggle ${imp.estado === 'Activo' ? 'badge-success' : 'badge-inactive'}`}
                    onClick={() => cambiarEstado(imp.id)}
                    title="Clic para cambiar estado"
                  >
                    {imp.estado}
                  </button>
                </td>
                <td data-label="Acciones">
                  <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => handleEditar(imp)} title="Editar" aria-label="Editar">
                    <Pencil size={18} />
                  </button>
                  <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => handleEliminar(imp)} title="Eliminar" aria-label="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableResponsive>

      {showCreateModal && (
        <ModalFormImpuesto
          onClose={() => setShowCreateModal(false)}
          onGuardar={(data) => {
            setImpuestos((prev) => [...prev, { ...data, id: Date.now() }])
            setShowCreateModal(false)
          }}
        />
      )}

      {showEditModal && impuestoEditando && (
        <ModalFormImpuesto
          impuesto={impuestoEditando}
          onClose={() => {
            setShowEditModal(false)
            setImpuestoEditando(null)
          }}
          onGuardar={(data) => {
            setImpuestos((prev) =>
              prev.map((i) => (i.id === impuestoEditando.id ? { ...i, ...data } : i))
            )
            setShowEditModal(false)
            setImpuestoEditando(null)
          }}
          esEdicion
        />
      )}

      {showDeleteModal && impuestoEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar impuesto"
          nombre={impuestoEliminar.nombre}
          onClose={() => {
            setShowDeleteModal(false)
            setImpuestoEliminar(null)
          }}
          onConfirmar={() => {
            setImpuestos((prev) => prev.filter((i) => i.id !== impuestoEliminar.id))
            setShowDeleteModal(false)
            setImpuestoEliminar(null)
          }}
        />
      )}
    </PageModule>
  )
}

function ModalConfirmarEliminar({ titulo, nombre, onClose, onConfirmar }) {
  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="form-header">
          <h3>{titulo}</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="form-body">
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            ¿Estás seguro de que deseas eliminar el impuesto <strong>{nombre}</strong>?
          </p>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="form-btn-primary" onClick={onConfirmar} style={{ background: '#dc2626' }}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalFormImpuesto({ impuesto, onClose, onGuardar, esEdicion = false }) {
  const [codigo, setCodigo] = useState(impuesto?.codigo ?? '')
  const [nombre, setNombre] = useState(impuesto?.nombre ?? '')
  const [porcentaje, setPorcentaje] = useState(impuesto?.porcentaje ?? '0%')
  const [descripcion, setDescripcion] = useState(impuesto?.descripcion ?? '')
  const [estado, setEstado] = useState(impuesto?.estado ?? 'Activo')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar({ codigo, nombre, porcentaje, descripcion, estado })
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
            <button type="submit" className="form-btn-primary">
              {esEdicion ? 'Guardar cambios' : 'Crear impuesto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
