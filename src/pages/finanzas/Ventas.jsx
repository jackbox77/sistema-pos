import { useRef, useState, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { useIngresos } from './IngresosLayout'
import { formatoTurno } from '../../utils/fechaUtils'
import { useMaestros } from '../../context/MaestrosContext'
import { getSalesUseCase } from '../../feature/finance/Sales/use-case'
import { getCurrentShiftUseCase } from '../../feature/shifts/use-case'
import { getLoyalCustomersAllUseCase } from '../../feature/masters/loyal-customers/use-case'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import '../../components/FormularioProductos/FormularioProductos.css'

function formatISOToFecha(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function mapSaleApiToUI(sale, shiftName = '') {
  return {
    id: sale.id,
    numero: sale.reference || sale.id?.slice(0, 8) || '-',
    cliente: sale.loyal_customer_id ? String(sale.loyal_customer_id).slice(0, 8) + '...' : '-',
    fecha: formatISOToFecha(sale.created_at),
    fechaFin: '',
    turno: shiftName,
    total: sale.total ?? 0,
    estado: 'Registrada',
  }
}

function generarNumeroFactura(existentes) {
  const nums = existentes
    .map((f) => parseInt(f.numero?.replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return `FV-${String(max + 1).padStart(3, '0')}`
}

function IngresosOVentasView({ mode }) {
  const isIngresos = mode === 'ingresos'
  const {
    facturasVentas, agregarFacturaVenta, actualizarFacturaVenta, eliminarFacturaVenta,
    loading: loadingIngresos, error: errorIngresos, loadIncomes, pagination: paginationIngresos
  } = useIngresos()
  const { productos } = useMaestros()
  const [ventasList, setVentasList] = useState([])
  const [loadingVentas, setLoadingVentas] = useState(false)
  const [errorVentas, setErrorVentas] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({
    cliente: '',
    fecha: new Date().toISOString().slice(0, 10),
    fechaFin: '',
    items: [],
    estado: 'Pendiente',
  })
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [cantidadAgregar, setCantidadAgregar] = useState(1)
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [loyalCustomerId, setLoyalCustomerId] = useState('')
  const [clientes, setClientes] = useState([])
  const [page, setPage] = useState(1)
  const [paginationVentas, setPaginationVentas] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 })

  useEffect(() => {
    getLoyalCustomersAllUseCase().then((res) => {
      if (res?.success && Array.isArray(res.data)) setClientes(res.data)
    }).catch(console.error)
  }, [])

  const loadVentas = useCallback(async (
    currentPage = page,
    search = searchTerm,
    min = minAmount,
    max = maxAmount,
    customer = loyalCustomerId
  ) => {
    if (isIngresos) {
      loadIncomes(currentPage, search, min, max)
      return
    }
    setErrorVentas(null)
    setLoadingVentas(true)
    try {
      const shiftRes = await getCurrentShiftUseCase()
      const shiftId = shiftRes?.data?.id
      const shiftName = shiftRes?.data?.name ?? ''
      if (!shiftId) {
        setVentasList([])
        return
      }
      const res = await getSalesUseCase(
        shiftId,
        currentPage,
        10,
        customer || undefined, // loyal_customer_id
        search.trim() || undefined,
        min ? Number(min) : undefined,
        max ? Number(max) : undefined
      )
      if (res?.success && Array.isArray(res?.data?.data)) {
        setVentasList(res.data.data.map((s) => mapSaleApiToUI(s, shiftName)))
        if (res.data.pagination) setPaginationVentas(res.data.pagination)
      } else {
        setVentasList([])
        setPaginationVentas({ page: 1, limit: 10, total: 0, total_pages: 1 })
      }
    } catch (err) {
      setErrorVentas(err?.message ?? 'No se pudieron cargar las ventas')
      setVentasList([])
      setPaginationVentas({ page: 1, limit: 10, total: 0, total_pages: 1 })
    } finally {
      setLoadingVentas(false)
    }
  }, [isIngresos])

  useEffect(() => {
    loadVentas(page, searchTerm, minAmount, maxAmount, loyalCustomerId)
  }, [page, isIngresos]) // Remove loadVentas from dependency to avoid loop if defined outside

  const aplicarFiltros = () => {
    setPage(1)
    const nuevos = []
    if (searchTerm.trim()) nuevos.push({ id: 'search', label: `Búsqueda: ${searchTerm}` })
    if (minAmount) nuevos.push({ id: 'min', label: `Mínimo: $${Number(minAmount).toLocaleString()}` })
    if (maxAmount) nuevos.push({ id: 'max', label: `Máximo: $${Number(maxAmount).toLocaleString()}` })
    if (loyalCustomerId) {
      const c = clientes.find(x => x.id === loyalCustomerId)
      nuevos.push({ id: 'customer', label: `Cliente: ${c ? (c.first_name + ' ' + c.last_name) : loyalCustomerId}` })
    }
    setFiltrosActivos(nuevos)

    if (isIngresos) loadIncomes(1, searchTerm, minAmount, maxAmount)
    else loadVentas(1, searchTerm, minAmount, maxAmount, loyalCustomerId)
  }

  const quitarFiltro = (id) => {
    if (id === 'search') setSearchTerm('')
    if (id === 'min') setMinAmount('')
    if (id === 'max') setMaxAmount('')
    if (id === 'customer') setLoyalCustomerId('')
    setFiltrosActivos((p) => p.filter((f) => f.id !== id))

    const newSearch = id === 'search' ? '' : searchTerm
    const newMin = id === 'min' ? '' : minAmount
    const newMax = id === 'max' ? '' : maxAmount
    const newCust = id === 'customer' ? '' : loyalCustomerId

    setPage(1)
    if (isIngresos) loadIncomes(1, newSearch, newMin, newMax)
    else loadVentas(1, newSearch, newMin, newMax, newCust)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') aplicarFiltros()
  }

  const agregarLinea = () => {
    const prod = productos.find((p) => p.id === Number(productoSeleccionado))
    if (!prod) return
    const precio = Number(prod.precio) || 0
    const cantidad = Number(cantidadAgregar) || 1
    const subtotal = precio * cantidad
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productoId: prod.id,
          nombre: prod.nombre,
          cantidad,
          precioUnitario: precio,
          subtotal,
        },
      ],
    }))
    setProductoSeleccionado('')
    setCantidadAgregar(1)
  }

  const quitarLinea = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const totalFactura = form.items.reduce((sum, it) => sum + (it.subtotal || 0), 0)

  const abrirNuevo = () => {
    setErrorGuardar('')
    setForm({
      cliente: '',
      fecha: new Date().toISOString().slice(0, 10),
      fechaFin: '',
      items: [],
      estado: 'Pendiente',
    })
    setEditing(null)
    setProductoSeleccionado('')
    setCantidadAgregar(1)
    setShowModal(true)
  }

  const abrirEditar = (f) => {
    setErrorGuardar('')
    setForm({
      numero: f.numero,
      cliente: f.cliente,
      fecha: f.fecha,
      fechaFin: f.fechaFin || '',
      items: f.items?.length ? f.items : [],
      estado: f.estado,
    })
    setEditing(f)
    setShowModal(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setErrorGuardar('')
    const numero = editing?.numero ?? generarNumeroFactura(facturasVentas)
    const data = {
      numero,
      cliente: form.cliente,
      fecha: form.fecha,
      fechaFin: form.fechaFin || undefined,
      items: form.items,
      total: totalFactura,
      estado: form.estado,
    }
    if (editing) {
      actualizarFacturaVenta(editing.id, data)
      setShowModal(false)
      return
    }
    try {
      await agregarFacturaVenta(data)
      setShowModal(false)
    } catch (err) {
      setErrorGuardar(err?.message ?? 'No se pudo guardar. Revisa los datos o intenta de nuevo.')
    }
  }

  const titulo = isIngresos ? 'Ingresos' : 'Ventas'
  const descripcion = isIngresos
    ? 'Registra y consulta los ingresos de tu negocio. Genera facturas de venta con los productos del catálogo.'
    : 'Registra y consulta las ventas realizadas. Genera ventas con los productos del catálogo.'
  const emptyMessage = isIngresos
    ? 'No hay ingresos registrados. Registra ventas o facturas usando los productos del catálogo.'
    : (errorVentas || 'No hay ventas registradas para el turno actual.')
  const colSpan = isIngresos ? 7 : 6
  const datosVentas = isIngresos ? facturasVentas : ventasList

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">{titulo}</h1>
            <p className="maestro-encabezado-desc">{descripcion}</p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            {isIngresos ? (
              <button type="button" className="btn-primary" onClick={abrirNuevo}>+ Registrar ingreso</button>
            ) : (
              <button type="button" className="form-btn-secondary" onClick={() => { }}>Exportar ventas</button>
            )}
          </div>
        </div>
        <div className="maestro-encabezado-filtros" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', paddingBottom: '16px' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label className="maestro-encabezado-label">Buscar {isIngresos ? 'factura o cliente' : 'venta o referencia'}</label>
            <input
              type="search"
              className="input-search"
              placeholder="Ej: FACT-001 o REF-001..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '100%', marginTop: '6px' }}
            />
          </div>
          {!isIngresos && (
            <div>
              <label className="maestro-encabezado-label">Cliente Fidelizado</label>
              <select
                className="input-search"
                value={loyalCustomerId}
                onChange={(e) => setLoyalCustomerId(e.target.value)}
                style={{ width: '180px', marginTop: '6px' }}
              >
                <option value="">Todos los clientes</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="maestro-encabezado-label">Monto mínimo</label>
            <input
              type="number"
              className="input-search"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '140px', marginTop: '6px' }}
            />
          </div>
          <div>
            <label className="maestro-encabezado-label">Monto máximo</label>
            <input
              type="number"
              className="input-search"
              placeholder="Sin límite"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '140px', marginTop: '6px' }}
            />
          </div>
          <div>
            <button type="button" className="btn-primary" onClick={aplicarFiltros}>
              Filtrar
            </button>
          </div>
        </div>

        {filtrosActivos.length > 0 && (
          <div className="maestro-encabezado-filtros-right" style={{ paddingBottom: '16px', borderTop: 'none' }}>
            <span className="maestro-encabezado-label">Filtros Activos:</span>
            {filtrosActivos.map((f) => (
              <span key={f.id} className="maestro-filtro-tag" style={{ marginLeft: '8px' }}>
                {f.label}
                <button type="button" onClick={() => quitarFiltro(f.id)} aria-label="Quitar filtro"><X size={14} /></button>
              </span>
            ))}
          </div>
        )}
      </header>
      {isIngresos && errorIngresos && (
        <div role="alert" style={{ marginTop: '16px', padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px' }}>
          {errorIngresos}
        </div>
      )}
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>{isIngresos ? 'Nº Factura' : 'Nº'}</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Total</th>
              <th>Estado</th>
              {isIngresos && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {isIngresos && loadingIngresos ? (
              <tr>
                <td colSpan={colSpan}>
                  <div className="page-module-empty">Cargando ingresos...</div>
                </td>
              </tr>
            ) : isIngresos && facturasVentas.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <div className="page-module-empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : !isIngresos && loadingVentas ? (
              <tr>
                <td colSpan={colSpan}>
                  <div className="page-module-empty">Cargando ventas...</div>
                </td>
              </tr>
            ) : !isIngresos && ventasList.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <div className="page-module-empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              datosVentas.map((f) => (
                <tr key={f.id}>
                  <td data-label={isIngresos ? 'Nº Factura' : 'Nº'}>{f.numero}</td>
                  <td data-label="Cliente">{f.cliente}</td>
                  <td data-label="Fecha">{f.fecha}</td>
                  <td data-label="Turno">{f.turno || formatoTurno(f.fecha, f.fechaFin)}</td>
                  <td data-label="Total">${Number(f.total || 0).toLocaleString('es-CO')}</td>
                  <td data-label="Estado">
                    <span className={`badge ${f.estado === 'Pagada' ? 'badge-success' : 'badge-pending'}`}>{f.estado}</span>
                  </td>
                  {isIngresos && (
                    <td data-label="Acciones">
                      <button type="button" className="btn-icon-action btn-icon-edit" onClick={() => abrirEditar(f)} title="Editar"><Pencil size={18} /></button>
                      <button type="button" className="btn-icon-action btn-icon-delete" onClick={() => setToDelete(f)} title="Eliminar"><Trash2 size={18} /></button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>

      {/* Paginación */}
      {!loadingIngresos && !loadingVentas && ((isIngresos ? paginationIngresos : paginationVentas)?.total_pages > 1) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '14px', color: '#4b5563' }}>
          <span>Mostrando {isIngresos ? facturasVentas.length : ventasList.length} de {isIngresos ? paginationIngresos.total : paginationVentas.total} {isIngresos ? 'ingresos' : 'ventas'}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
                background: page === 1 ? '#f3f4f6' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                color: page === 1 ? '#9ca3af' : '#374151', fontWeight: 500
              }}
            >
              Anterior
            </button>
            <span style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 600 }}>
              {page} / {isIngresos ? paginationIngresos.total_pages : paginationVentas.total_pages}
            </span>
            <button
              type="button"
              disabled={page === (isIngresos ? paginationIngresos.total_pages : paginationVentas.total_pages)}
              onClick={() => setPage(page + 1)}
              style={{
                padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
                background: page === (isIngresos ? paginationIngresos.total_pages : paginationVentas.total_pages) ? '#f3f4f6' : '#fff',
                cursor: page === (isIngresos ? paginationIngresos.total_pages : paginationVentas.total_pages) ? 'not-allowed' : 'pointer',
                color: page === (isIngresos ? paginationIngresos.total_pages : paginationVentas.total_pages) ? '#9ca3af' : '#374151', fontWeight: 500
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {isIngresos && showModal && (
        <div className="form-overlay" onClick={() => setShowModal(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="form-header">
              <h3>{editing ? 'Editar ingreso' : 'Registrar ingreso'}</h3>
              <button type="button" className="form-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              {errorGuardar && (
                <div role="alert" style={{ padding: '12px', marginBottom: '16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px' }}>
                  {errorGuardar}
                </div>
              )}
              <div className="config-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="config-field">
                  <label>Cliente *</label>
                  <input type="text" value={form.cliente} onChange={(e) => setForm((p) => ({ ...p, cliente: e.target.value }))} placeholder="Nombre o razón social" required />
                </div>
                <div className="config-field">
                  <label>Fecha *</label>
                  <input type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} required />
                </div>
                <div className="config-field">
                  <label>Fecha fin (turno)</label>
                  <input type="date" value={form.fechaFin} onChange={(e) => setForm((p) => ({ ...p, fechaFin: e.target.value }))} placeholder="Opcional: intervalo de días" min={form.fecha} />
                </div>
              </div>

              <div className="config-field" style={{ marginTop: '16px' }}>
                <label>Agregar producto</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <select
                      value={productoSeleccionado}
                      onChange={(e) => setProductoSeleccionado(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    >
                      <option value="">Seleccionar producto...</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre} - ${Number(p.precio || 0).toLocaleString('es-CO')}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '100px' }}>
                    <input type="number" min="1" value={cantidadAgregar} onChange={(e) => setCantidadAgregar(Number(e.target.value) || 1)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                  </div>
                  <button type="button" className="form-btn-secondary" onClick={agregarLinea} disabled={!productoSeleccionado}>
                    <Plus size={18} /> Agregar
                  </button>
                </div>
              </div>

              {form.items.length > 0 && (
                <div style={{ marginTop: '16px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Producto</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Cant.</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>P. unit.</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Subtotal</th>
                        <th style={{ width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '8px' }}>{it.nombre}</td>
                          <td style={{ textAlign: 'right', padding: '8px' }}>{it.cantidad}</td>
                          <td style={{ textAlign: 'right', padding: '8px' }}>${Number(it.precioUnitario || 0).toLocaleString('es-CO')}</td>
                          <td style={{ textAlign: 'right', padding: '8px' }}>${Number(it.subtotal || 0).toLocaleString('es-CO')}</td>
                          <td>
                            <button type="button" onClick={() => quitarLinea(idx)} className="btn-icon-action btn-icon-delete" title="Quitar" style={{ padding: '4px' }}><X size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ marginTop: '8px', fontWeight: 700, textAlign: 'right' }}>Total: ${totalFactura.toLocaleString('es-CO')}</p>
                </div>
              )}

              <div className="config-field" style={{ marginTop: '16px' }}>
                <label>Estado</label>
                <select value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}>
                  <option>Pendiente</option>
                  <option>Pagada</option>
                  <option>Anulada</option>
                </select>
              </div>

              <div className="form-footer" style={{ marginTop: '20px' }}>
                <button type="button" className="form-btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="form-btn-primary" disabled={!form.cliente?.trim()}>Guardar ingreso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isIngresos && toDelete && (
        <div className="form-overlay" onClick={() => setToDelete(null)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="form-header">
              <h3>Eliminar ingreso</h3>
              <button type="button" className="form-close" onClick={() => setToDelete(null)}>✕</button>
            </div>
            <div className="form-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>¿Eliminar el ingreso <strong>{toDelete.numero}</strong> de {toDelete.cliente}?</p>
              <div className="form-footer">
                <button type="button" className="form-btn-secondary" onClick={() => setToDelete(null)}>Cancelar</button>
                <button type="button" className="form-btn-primary" onClick={() => { eliminarFacturaVenta(toDelete.id); setToDelete(null); }} style={{ background: '#dc2626' }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageModule>
  )
}

export function FacturaVentas() {
  return <IngresosOVentasView mode="ingresos" />
}

export default function Ventas() {
  return <IngresosOVentasView mode="ventas" />
}
