import { useRef, useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Upload, Download, ChevronDown, X } from 'lucide-react'
import { useProveedores } from './ProveedoresLayout'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function ProveedoresList() {
  const { proveedores, eliminarProveedor, agregarProveedor } = useProveedores()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [proveedorEliminar, setProveedorEliminar] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const proveedoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return proveedores
    const q = busqueda.toLowerCase().trim()
    return proveedores.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.numeroDocumento && p.numeroDocumento.toLowerCase().includes(q)) ||
        (p.contacto && p.contacto.toLowerCase().includes(q))
    )
  }, [proveedores, busqueda])

  const handleEliminar = (p) => {
    setProveedorEliminar(p)
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
  const descargarPlantillaProveedores = () => {
    descargarPlantilla(
      ['tipoDocumento', 'numeroDocumento', 'nombre', 'contacto', 'telefono'],
      ['NIT', '900.111.222-3', 'Proveedor Ejemplo S.A.S.', 'Contacto', '300 111 2233'],
      'plantilla_proveedores.csv'
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
      datos.forEach((f) => {
        if (!f[2]?.trim()) return
        agregarProveedor({
          tipoDocumento: (f[0] ?? 'NIT').trim(),
          numeroDocumento: (f[1] ?? '').trim(),
          nombre: (f[2] ?? '').trim(),
          contacto: (f[3] ?? '').trim(),
          telefono: (f[4] ?? '').trim(),
        })
      })
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
            <h1 className="maestro-encabezado-titulo">Proveedores</h1>
            <p className="maestro-encabezado-desc">
              Registro y edición de proveedores. Visualización de compras asociadas a cada proveedor.
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
                  <button type="button" onClick={() => { descargarPlantillaProveedores(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar plantilla
                  </button>
                  <button type="button" onClick={() => { inputCargaRef.current?.click(); setShowMasAcciones(false); }}>
                    <Upload size={18} /> Carga masiva
                  </button>
                </div>
              )}
            </div>
            <Link to="/app/maestros/proveedores/nuevo" className="btn-primary" style={{ textDecoration: 'none' }}>
              + Nuevo proveedor
            </Link>
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
        <input
          type="search"
          className="input-search"
          placeholder="Buscar por nombre, documento o contacto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Tipo doc.</th>
              <th>Nº documento</th>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Compras asociadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p) => (
              <tr key={p.id}>
                <td data-label="Tipo doc.">{p.tipoDocumento ?? (p.nit ? 'NIT' : '—')}</td>
                <td data-label="Nº documento">{p.numeroDocumento ?? p.nit ?? '—'}</td>
                <td data-label="Nombre">{p.nombre}</td>
                <td data-label="Contacto">{p.contacto}</td>
                <td data-label="Teléfono">{p.telefono}</td>
                <td data-label="Compras asociadas">{p.comprasAsociadas}</td>
                <td data-label="Acciones">
                  <Link to={`/maestros/proveedores/editar/${p.id}`} className="btn-icon-action btn-icon-edit" title="Editar" aria-label="Editar">
                    <Pencil size={18} />
                  </Link>
                  <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => handleEliminar(p)} title="Eliminar" aria-label="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableResponsive>
      {proveedoresFiltrados.length === 0 && (
        <p className="page-module-empty">
          {busqueda ? 'No hay proveedores que coincidan con la búsqueda.' : 'No hay proveedores. Crea uno con el botón "+ Nuevo proveedor".'}
        </p>
      )}

      {showDeleteModal && proveedorEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar proveedor"
          nombre={proveedorEliminar.nombre}
          onClose={() => {
            setShowDeleteModal(false)
            setProveedorEliminar(null)
          }}
          onConfirmar={() => {
            eliminarProveedor(proveedorEliminar.id)
            setShowDeleteModal(false)
            setProveedorEliminar(null)
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
            ¿Estás seguro de que deseas eliminar <strong>{nombre}</strong>?
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
