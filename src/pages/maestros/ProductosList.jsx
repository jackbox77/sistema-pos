import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Upload, Download, ChevronDown, Image as ImageIcon, X } from 'lucide-react'
import { useProductos } from './ProductosLayout'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

export default function ProductosList() {
  const { productos, getCategoria, eliminarProducto, agregarProducto } = useProductos()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productoEliminar, setProductoEliminar] = useState(null)

  const handleEliminar = (prod) => {
    setProductoEliminar(prod)
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
  const descargarPlantillaProductos = () => {
    descargarPlantilla(
      ['codigo', 'nombre', 'categoria', 'precio', 'impuesto'],
      ['PROD-003', 'Leche 1L', 'Lácteos', '3200', 'IVA 19%'],
      'plantilla_productos.csv'
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
        if (!f[0]?.trim()) return
        agregarProducto({
          codigo: (f[0] ?? '').trim(),
          nombre: (f[1] ?? '').trim(),
          categoria: (f[2] ?? 'Alimentos').trim(),
          precio: (f[3] ?? '0').trim(),
          impuesto: (f[4] ?? 'IVA 19%').trim(),
          imagen: '',
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
            <h1 className="maestro-encabezado-titulo">Productos</h1>
            <p className="maestro-encabezado-desc">
              Ver, crear, editar y eliminar productos. Búsqueda rápida y filtrado. Asociación a categorías e impuestos.
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
                  <button type="button" onClick={() => { descargarPlantillaProductos(); setShowMasAcciones(false); }}>
                    <Download size={18} /> Descargar plantilla
                  </button>
                  <button type="button" onClick={() => { inputCargaRef.current?.click(); setShowMasAcciones(false); }}>
                    <Upload size={18} /> Carga masiva
                  </button>
                </div>
              )}
            </div>
            <Link to="/app/maestros/productos/nuevo" className="btn-primary" style={{ textDecoration: 'none' }}>
              + Nuevo producto
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
        <input type="search" className="input-search" placeholder="Buscar productos..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Impuesto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td data-label="Imagen">
                  {prod.imagen ? (
                    <img src={prod.imagen} alt="" className="categoria-thumb" />
                  ) : (
                    <span className="categoria-thumb-sin-imagen" title="Sin imagen">
                      <ImageIcon size={24} />
                    </span>
                  )}
                </td>
                <td data-label="Código">{prod.codigo}</td>
                <td data-label="Nombre">{prod.nombre}</td>
                <td data-label="Categoría">{getCategoria(prod.categoriaId)?.nombre ?? '-'}</td>
                <td data-label="Precio">${Number(prod.precio).toLocaleString()}</td>
                <td data-label="Impuesto">{prod.impuesto}</td>
                <td data-label="Acciones">
                  <Link to={`/app/maestros/productos/editar/${prod.id}`} className="btn-icon-action btn-icon-edit" title="Editar" aria-label="Editar">
                    <Pencil size={18} />
                  </Link>
                  <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => handleEliminar(prod)} title="Eliminar" aria-label="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableResponsive>

      {showDeleteModal && productoEliminar && (
        <ModalConfirmarEliminar
          nombre={productoEliminar.nombre}
          onClose={() => {
            setShowDeleteModal(false)
            setProductoEliminar(null)
          }}
          onConfirmar={() => {
            eliminarProducto(productoEliminar.id)
            setShowDeleteModal(false)
            setProductoEliminar(null)
          }}
        />
      )}
    </PageModule>
  )
}

function ModalConfirmarEliminar({ nombre, onClose, onConfirmar }) {
  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="form-header">
          <h3>Eliminar producto</h3>
          <button className="form-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="form-body">
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            ¿Estás seguro de que deseas eliminar el producto <strong>{nombre}</strong>?
          </p>
          <div className="form-footer">
            <button type="button" className="form-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="form-btn-primary"
              onClick={onConfirmar}
              style={{ background: '#dc2626' }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
