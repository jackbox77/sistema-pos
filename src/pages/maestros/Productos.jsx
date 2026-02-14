import { useRef, useState, useEffect } from 'react'
import { Pencil, Trash2, Upload, Download, Filter, ChevronDown, Image as ImageIcon } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import { descargarPlantilla, parsearCSV } from '../../utils/csvMaestros'

const productosIniciales = [
  { id: 1, codigo: 'PROD-001', nombre: 'Arroz 1kg', categoria: 'Alimentos', precio: '3500', impuesto: 'IVA 19%', imagen: '' },
  { id: 2, codigo: 'PROD-002', nombre: 'Gaseosa 400ml', categoria: 'Bebidas', precio: '2200', impuesto: 'IVA 19%', imagen: '' },
]

export default function Productos() {
  const [productos, setProductos] = useState(productosIniciales)
  const [showMasAcciones, setShowMasAcciones] = useState(false)
  const masAccionesRef = useRef(null)
  const inputCargaRef = useRef(null)

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
      const nuevos = datos
        .filter((f) => f[0]?.trim())
        .map((f, i) => ({
          id: Date.now() + i,
          codigo: (f[0] ?? '').trim(),
          nombre: (f[1] ?? '').trim(),
          categoria: (f[2] ?? 'Alimentos').trim(),
          precio: (f[3] ?? '0').trim(),
          impuesto: (f[4] ?? 'IVA 19%').trim(),
          imagen: '',
        }))
      setProductos((prev) => [...prev, ...nuevos])
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  return (
    <PageModule
      title="Productos"
      description="Ver, crear, editar y eliminar productos. Búsqueda rápida y filtrado. Asociación a categorías e impuestos. Visualización optimizada para POS."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo producto</button>
        <input type="search" className="input-search" placeholder="Buscar productos..." />
        <div className="toolbar-filter-wrap">
          <Filter size={18} className="toolbar-filter-icon" aria-hidden />
          <select className="input-select">
            <option>Todas las categorías</option>
          </select>
        </div>
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
        <input
          ref={inputCargaRef}
          type="file"
          accept=".csv"
          className="input-file"
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
          onChange={handleCargaMasiva}
        />
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
                <td data-label="Categoría">{prod.categoria}</td>
                <td data-label="Precio">${Number(prod.precio).toLocaleString()}</td>
                <td data-label="Impuesto">{prod.impuesto}</td>
                <td data-label="Acciones">
                  <button type="button" className="btn-icon-action btn-icon-edit" title="Editar" aria-label="Editar">
                    <Pencil size={18} />
                  </button>
                  <button type="button" className="btn-icon-action btn-icon-delete" title="Eliminar" aria-label="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
