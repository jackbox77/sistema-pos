import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import { getExpensesUseCase, createExpenseUseCase } from '../../feature/finance/Discharge/use-case'
import { getCurrentShiftUseCase } from '../../feature/shifts/use-case'

function formatISOToFecha(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export default function Egresos() {
  const [egresos, setEgresos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ concept: '', reference: '', amount: '' })
  const [errorGuardar, setErrorGuardar] = useState('')
  const [saving, setSaving] = useState(false)

  // Filtros y Paginación
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const [searchTerm, setSearchTerm] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [selectedShiftId, setSelectedShiftId] = useState('')
  const [shifts, setShifts] = useState([])
  const [filtrosActivos, setFiltrosActivos] = useState([])

  useEffect(() => {
    getShiftsUseCase(1, 100).then((res) => {
      if (res?.success && Array.isArray(res.data?.data)) setShifts(res.data.data)
    }).catch(console.error)
  }, [])

  const loadEgresos = useCallback(async (
    currentPage = page,
    search = searchTerm,
    min = minAmount,
    max = maxAmount,
    shiftIdInput = undefined
  ) => {
    setError(null)
    setLoading(true)
    try {
      let shiftIdToUse = shiftIdInput
      if (shiftIdToUse === undefined) {
        const shiftRes = await getCurrentShiftUseCase()
        shiftIdToUse = shiftRes?.data?.id ?? null
      }

      const res = await getExpensesUseCase(
        shiftIdToUse || undefined,
        currentPage,
        limit,
        search.trim() || undefined,
        min ? Number(min) : undefined,
        max ? Number(max) : undefined
      )

      if (res?.success && Array.isArray(res?.data?.data)) {
        setEgresos(res.data.data)
        setTotalPages(res.data.pagination?.total_pages || 1)
        setTotalItems(res.data.pagination?.total || 0)
      } else {
        setEgresos([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (err) {
      setError(err?.message ?? 'No se pudieron cargar los egresos')
      setEgresos([])
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    loadEgresos(page, searchTerm, minAmount, maxAmount, selectedShiftId)
  }, [page, searchTerm, minAmount, maxAmount, selectedShiftId, loadEgresos])

  const aplicarFiltros = () => {
    setPage(1) // Volver a la página 1 al filtrar

    const nuevosFiltros = []
    if (searchTerm.trim()) nuevosFiltros.push({ id: 'search', label: `Búsqueda: ${searchTerm}` })
    if (minAmount) nuevosFiltros.push({ id: 'min', label: `Mínimo: $${Number(minAmount).toLocaleString()}` })
    if (maxAmount) nuevosFiltros.push({ id: 'max', label: `Máximo: $${Number(maxAmount).toLocaleString()}` })
    if (selectedShiftId) {
      const s = shifts.find(x => x.id === selectedShiftId)
      if (s) nuevosFiltros.push({ id: 'shift', label: `Turno: ${s.name}` })
    }
    setFiltrosActivos(nuevosFiltros)

    loadEgresos(1, searchTerm, minAmount, maxAmount, selectedShiftId)
  }

  const quitarFiltro = (id) => {
    if (id === 'search') setSearchTerm('')
    if (id === 'min') setMinAmount('')
    if (id === 'max') setMaxAmount('')
    if (id === 'shift') setSelectedShiftId('')

    const nuevos = filtrosActivos.filter(f => f.id !== id)
    setFiltrosActivos(nuevos)

    setPage(1)
    loadEgresos(1,
      id === 'search' ? '' : searchTerm,
      id === 'min' ? '' : minAmount,
      id === 'max' ? '' : maxAmount,
      id === 'shift' ? '' : selectedShiftId
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') aplicarFiltros()
  }

  const abrirModal = () => {
    setErrorGuardar('')
    setForm({ concept: '', reference: '', amount: '' })
    setShowModal(true)
  }

  const guardar = async (e) => {
    e.preventDefault()
    setErrorGuardar('')
    const amount = Number(form.amount)
    if (!form.concept?.trim()) {
      setErrorGuardar('El concepto es obligatorio.')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setErrorGuardar('El monto debe ser un número mayor que 0.')
      return
    }
    setSaving(true)
    try {
      const shiftRes = await getCurrentShiftUseCase()
      const shiftId = shiftRes?.data?.id
      if (!shiftId) {
        setErrorGuardar('No hay turno abierto. Abre un turno para registrar egresos.')
        setSaving(false)
        return
      }
      await createExpenseUseCase({
        shift_id: shiftId,
        amount,
        concept: form.concept.trim(),
        reference: (form.reference || '').trim() || undefined,
      })
      await loadEgresos()
      setShowModal(false)
    } catch (err) {
      setErrorGuardar(err?.message ?? 'No se pudo registrar el egreso.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageModule title="" description="">
      <header className="maestro-encabezado">
        <div className="maestro-encabezado-top">
          <div className="maestro-encabezado-info">
            <h1 className="maestro-encabezado-titulo">Egresos</h1>
            <p className="maestro-encabezado-desc">Registro de salidas de dinero: pagos, gastos operativos y demás egresos.</p>
            <a href="#ver-mas" className="maestro-encabezado-link">Ver más</a>
          </div>
          <div className="maestro-encabezado-acciones">
            <button type="button" className="btn-primary" onClick={abrirModal}>
              + Registrar egreso
            </button>
          </div>
        </div>
        <div className="maestro-encabezado-filtros" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          alignItems: 'end'
        }}>
          <div className="filter-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155', fontSize: '13px', marginBottom: '8px' }}>
              Buscar concepto o referencia
            </label>
            <input
              type="search"
              placeholder="Ej: transporte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div className="filter-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155', fontSize: '13px', marginBottom: '8px' }}>
              Filtrar por Turno
            </label>
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '14px', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="">Todos los turnos registrados</option>
              {shifts.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({new Date(s.start_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#334155', fontSize: '13px', marginBottom: '8px' }}>
              Rango de Monto
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={aplicarFiltros}
              style={{ flex: '1', padding: '12px', borderRadius: '10px', background: '#0d9488', color: '#fff', fontWeight: 600, cursor: 'pointer', border: 'none', fontSize: '14px' }}
            >
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
      {error && (
        <div role="alert" style={{ marginTop: '16px', padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Referencia</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">
                  <div className="page-module-empty">Cargando egresos...</div>
                </td>
              </tr>
            ) : egresos.length === 0 ? (
              <tr>
                <td colSpan="4">
                  <div className="page-module-empty">
                    No hay egresos registrados. Usa &quot;+ Registrar egreso&quot; para registrar pagos y salidas de dinero.
                  </div>
                </td>
              </tr>
            ) : (
              egresos.map((eg) => (
                <tr key={eg.id}>
                  <td data-label="Fecha">{formatISOToFecha(eg.created_at)}</td>
                  <td data-label="Concepto">{eg.concept ?? '-'}</td>
                  <td data-label="Referencia">{eg.reference ?? '-'}</td>
                  <td data-label="Monto">${Number(eg.amount ?? 0).toLocaleString('es-CO')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableResponsive>

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '14px', color: '#4b5563' }}>
          <span>Mostrando {egresos.length} de {totalItems} egresos</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{
                padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
                background: page === 1 ? '#f3f4f6' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                color: page === 1 ? '#9ca3af' : '#374151', fontWeight: 500
              }}
            >
              Anterior
            </button>
            <span style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 600 }}>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
                background: page === totalPages ? '#f3f4f6' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                color: page === totalPages ? '#9ca3af' : '#374151', fontWeight: 500
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="form-overlay" onClick={() => !saving && setShowModal(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="form-header">
              <h3>Registrar egreso</h3>
              <button type="button" className="form-close" onClick={() => !saving && setShowModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <form onSubmit={guardar} className="form-body">
              {errorGuardar && (
                <div role="alert" style={{ padding: '12px', marginBottom: '16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px' }}>
                  {errorGuardar}
                </div>
              )}
              <div className="config-field">
                <label>Concepto *</label>
                <input
                  type="text"
                  value={form.concept}
                  onChange={(e) => setForm((p) => ({ ...p, concept: e.target.value }))}
                  placeholder="Ej: Compra de material"
                  required
                />
              </div>
              <div className="config-field">
                <label>Referencia</label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))}
                  placeholder="Ej: FACT-001"
                />
              </div>
              <div className="config-field">
                <label>Monto *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0"
                  required
                />
              </div>
              <div className="form-footer" style={{ marginTop: '20px' }}>
                <button type="button" className="form-btn-secondary" onClick={() => !saving && setShowModal(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" className="form-btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar egreso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageModule>
  )
}
