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
  const [listaPrecios, setListaPrecios] = useState('general')
  const [filtrosActivos, setFiltrosActivos] = useState([{ id: 'estado', label: 'Estado: todas' }])

  const loadEgresos = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const shiftRes = await getCurrentShiftUseCase()
      const shiftId = shiftRes?.data?.id
      if (!shiftId) {
        setEgresos([])
        return
      }
      const res = await getExpensesUseCase(shiftId, 1, 100)
      if (res?.success && Array.isArray(res?.data?.data)) {
        setEgresos(res.data.data)
      } else {
        setEgresos([])
      }
    } catch (err) {
      setError(err?.message ?? 'No se pudieron cargar los egresos')
      setEgresos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEgresos()
  }, [loadEgresos])

  const quitarFiltro = (id) => setFiltrosActivos((p) => p.filter((f) => f.id !== id))

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
        <div className="maestro-encabezado-filtros">
          <div className="maestro-encabezado-filtros-left">
            <label className="maestro-encabezado-label">Lista de precios</label>
            <select className="maestro-encabezado-select" value={listaPrecios} onChange={(e) => setListaPrecios(e.target.value)}>
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
                  <button type="button" onClick={() => quitarFiltro(f.id)} aria-label="Quitar filtro"><X size={14} /></button>
                </span>
              ))
            ) : (
              <span className="maestro-filtro-sin">Ninguno</span>
            )}
          </div>
        </div>
      </header>
      {error && (
        <div role="alert" style={{ marginTop: '16px', padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      <div className="page-module-toolbar" style={{ marginTop: '16px' }}>
        <input type="search" className="input-search" placeholder="Buscar egresos..." />
      </div>
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
