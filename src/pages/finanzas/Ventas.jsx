import { useRef, useState, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Plus, X, Search, User, History, DollarSign, Filter, Eraser, AlertCircle, Printer } from 'lucide-react'
import { useIngresos } from './IngresosLayout'
import { formatoTurno } from '../../utils/fechaUtils'
import { useMaestros } from '../../context/MaestrosContext'
import { getSalesUseCase } from '../../feature/finance/Sales/use-case'
import { getCurrentShiftUseCase, getShiftsUseCase } from '../../feature/shifts/use-case'
import { getLoyalCustomersAllUseCase } from '../../feature/masters/loyal-customers/use-case'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import ComprobanteImpresion from '../../components/ComprobanteImpresion/ComprobanteImpresion'
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
    turno: sale.shift?.name || shiftName || '-',
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
  const [showInfoReportes, setShowInfoReportes] = useState(false)
  const [comprobanteImpresion, setComprobanteImpresion] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [loyalCustomerId, setLoyalCustomerId] = useState('')
  const [selectedShiftId, setSelectedShiftId] = useState('')
  const [clientes, setClientes] = useState([])
  const [shifts, setShifts] = useState([])
  const [page, setPage] = useState(1)
  const [paginationVentas, setPaginationVentas] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 })

  useEffect(() => {
    getLoyalCustomersAllUseCase().then((res) => {
      if (res?.success && Array.isArray(res.data)) setClientes(res.data)
    }).catch(console.error)

    getShiftsUseCase(1, 50).then((res) => {
      if (res?.success && Array.isArray(res.data?.data)) setShifts(res.data.data)
    }).catch(console.error)
  }, [])

  const loadVentas = useCallback(async (
    currentPage = page,
    search = searchTerm,
    min = minAmount,
    max = maxAmount,
    customer = loyalCustomerId,
    shift = selectedShiftId
  ) => {
    if (isIngresos) {
      loadIncomes(currentPage, search, min, max, shift, undefined)
      return
    }
    setErrorVentas(null)
    setLoadingVentas(true)
    try {
      const res = await getSalesUseCase(
        shift || null,
        currentPage,
        10,
        customer || undefined,
        search.trim() || undefined,
        min ? Number(min) : undefined,
        max ? Number(max) : undefined
      )
      if (res?.success && Array.isArray(res?.data?.data)) {
        setVentasList(res.data.data.map((s) => mapSaleApiToUI(s)))
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
  }, [isIngresos, loadIncomes])

  useEffect(() => {
    loadVentas(page, searchTerm, minAmount, maxAmount, loyalCustomerId, selectedShiftId)
  }, [page, isIngresos, searchTerm, minAmount, maxAmount, loyalCustomerId, selectedShiftId, loadVentas])

  const aplicarFiltros = () => {
    setPage(1)
    const nuevos = []
    if (searchTerm.trim()) nuevos.push({ id: 'search', label: `Búsqueda: ${searchTerm}` })
    if (minAmount) nuevos.push({ id: 'min', label: `Mínimo: $${Number(minAmount).toLocaleString()}` })
    if (maxAmount) nuevos.push({ id: 'max', label: `Máximo: $${Number(maxAmount).toLocaleString()}` })
    if (!isIngresos && loyalCustomerId) {
      const c = clientes.find(x => x.id === loyalCustomerId)
      if (c) nuevos.push({ id: 'customer', label: `Cliente: ${c.full_name || (c.first_name + ' ' + (c.last_name || ''))}` })
    }
    if (selectedShiftId) {
      const s = shifts.find(x => x.id === selectedShiftId)
      if (s) nuevos.push({ id: 'shift', label: `Turno: ${s.name}` })
    }
    setFiltrosActivos(nuevos)

    loadVentas(1, searchTerm, minAmount, maxAmount, loyalCustomerId, selectedShiftId)
  }

  const quitarFiltro = (id) => {
    if (id === 'search') setSearchTerm('')
    if (id === 'min') setMinAmount('')
    if (id === 'max') setMaxAmount('')
    if (id === 'customer') setLoyalCustomerId('')
    if (id === 'shift') setSelectedShiftId('')
    const nuevos = filtrosActivos.filter(f => f.id !== id)
    setFiltrosActivos(nuevos)

    loadVentas(1,
      id === 'search' ? '' : searchTerm,
      id === 'min' ? '' : minAmount,
      id === 'max' ? '' : maxAmount,
      id === 'customer' ? '' : loyalCustomerId,
      id === 'shift' ? '' : selectedShiftId
    )
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
    : (errorVentas || 'No hay ventas registradas en el sistema.')
  const colSpan = isIngresos ? 8 : 7
  const datosVentas = isIngresos ? facturasVentas : ventasList

  return (
    <PageModule title="" description="" fullWidth>
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">{titulo}</h1>
            <p className="maestro-encabezado-desc">{descripcion}</p>
          </div>
          <div className="maestro-encabezado-acciones">
            {isIngresos ? (
              <button type="button" className="btn-primary" onClick={abrirNuevo}>+ Registrar ingreso</button>
            ) : (
              <button type="button" className="form-btn-secondary" onClick={() => { }}>Exportar ventas</button>
            )}
          </div>
        </div>
      </header>
      {showInfoReportes && (
        <div className="form-overlay" onClick={() => setShowInfoReportes(false)} role="dialog" aria-modal="true" aria-labelledby="info-reportes-finanzas">
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <div className="form-header">
              <h3 id="info-reportes-finanzas">Información</h3>
              <button className="form-close" onClick={() => setShowInfoReportes(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className="form-body">
              <p style={{ margin: 0, color: '#374151' }}>
                Si quieres visualizar información anterior al turno, revisa reportes.
              </p>
              <div className="form-footer" style={{ marginTop: '1rem' }}>
                <button type="button" className="form-btn-primary" onClick={() => setShowInfoReportes(false)}>Entendido</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="maestro-encabezado-filtros" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Sutil gradiente de adorno */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(13, 148, 136, 0.05)', borderRadius: '50%' }}></div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: '16px'
          }}>
            <div className="filter-group" style={{ flex: '1 1 160px', minWidth: '140px', maxWidth: '220px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155', fontSize: '13px', marginBottom: '8px' }}>
                <Search size={14} style={{ color: '#0d9488' }} /> Buscar venta o referencia
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="search"
                  placeholder="Ej: FACT-001..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', transition: 'all 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}
                />
              </div>
            </div>

            {!isIngresos && (
              <div className="filter-group" style={{ flex: '1 1 160px', minWidth: '140px', maxWidth: '220px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155', fontSize: '13px', marginBottom: '8px' }}>
                  <User size={14} style={{ color: '#0d9488' }} /> Cliente Fidelizado
                </label>
                <select
                  value={loyalCustomerId}
                  onChange={(e) => setLoyalCustomerId(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '14px', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                >
                  <option value="">Todos los clientes</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.full_name || (c.first_name + ' ' + (c.last_name || ''))}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-group" style={{ flex: '1 1 160px', minWidth: '140px', maxWidth: '220px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155', fontSize: '13px', marginBottom: '8px' }}>
                <History size={14} style={{ color: '#0d9488' }} /> Filtrar por Turno
              </label>
              <select
                value={selectedShiftId}
                onChange={(e) => setSelectedShiftId(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '14px', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                <option value="">Todos los turnos registrado</option>
                {shifts.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({new Date(s.start_at).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group" style={{ flex: '1 1 140px', minWidth: '120px', maxWidth: '180px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155', fontSize: '13px', marginBottom: '8px' }}>
                <DollarSign size={14} style={{ color: '#0d9488' }} /> Rango de Monto
              </label>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="Mín."
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
                <input
                  type="number"
                  placeholder="Máx."
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flex: '0 0 auto', alignItems: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setMinAmount('')
                  setMaxAmount('')
                  setLoyalCustomerId('')
                  setSelectedShiftId('')
                  setFiltrosActivos([])
                  loadVentas(1, '', '', '', '', '')
                }}
                style={{ flex: '0.4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
                title="Limpiar filtros"
              >
                <Eraser size={18} />
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={aplicarFiltros}
                style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', background: '#0d9488', color: '#fff', fontWeight: 600, cursor: 'pointer', border: 'none', fontSize: '14px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)' }}
              >
                <Filter size={18} /> Filtrar
              </button>
              <button
                type="button"
                onClick={() => setShowInfoReportes(true)}
                className="metodos-pago-btn-alert"
                title="Información sobre datos anteriores al turno"
                aria-label="Información: ver reportes para datos anteriores al turno"
                style={{ flexShrink: 0 }}
              >
                <AlertCircle size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>

        {filtrosActivos.length > 0 && (
          <div className="maestro-encabezado-filtros-right" style={{ paddingBottom: '20px', borderTop: 'none', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Filtros aplicados:</span>
            {filtrosActivos.map((f) => (
              <span key={f.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', border: '1px solid #e2e8f0' }}>
                {f.label}
                <button type="button" onClick={() => quitarFiltro(f.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: '2px' }}><X size={14} /></button>
              </span>
            ))}
          </div>
        )}
      </div>
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
              <th>Imprimir</th>
              {isIngresos && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {isIngresos && loadingIngresos ? (
              <tr>
                <td colSpan={isIngresos ? 8 : 7}>
                  <div className="page-module-empty">Cargando ingresos...</div>
                </td>
              </tr>
            ) : isIngresos && facturasVentas.length === 0 ? (
              <tr>
                <td colSpan={isIngresos ? 8 : 7}>
                  <div className="page-module-empty">{emptyMessage}</div>
                </td>
              </tr>
            ) : !isIngresos && loadingVentas ? (
              <tr>
                <td colSpan={isIngresos ? 8 : 7}>
                  <div className="page-module-empty">Cargando ventas...</div>
                </td>
              </tr>
            ) : !isIngresos && ventasList.length === 0 ? (
              <tr>
                <td colSpan={isIngresos ? 8 : 7}>
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
                  <td data-label="Imprimir">
                    <button type="button" className="btn-icon-action" onClick={() => setComprobanteImpresion(f)} title="Visualizar impresión" aria-label="Imprimir">
                      <Printer size={18} />
                    </button>
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

      {comprobanteImpresion && (
        <ComprobanteImpresion
          open={!!comprobanteImpresion}
          onClose={() => setComprobanteImpresion(null)}
          title={isIngresos ? 'Comprobante de ingreso' : 'Comprobante de venta'}
          lineas={[
            { label: 'Nº', value: comprobanteImpresion.numero },
            { label: 'Cliente', value: comprobanteImpresion.cliente },
            { label: 'Fecha', value: comprobanteImpresion.fecha },
            { label: 'Turno', value: comprobanteImpresion.turno || '-' },
            { label: 'Total', value: `$${Number(comprobanteImpresion.total || 0).toLocaleString('es-CO')}` },
            { label: 'Estado', value: comprobanteImpresion.estado },
          ]}
        />
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
