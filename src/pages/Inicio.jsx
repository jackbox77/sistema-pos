import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import PageModule from '../components/PageModule/PageModule'
import { getCurrentShiftUseCase } from '../feature/shifts/use-case'
import {
  getReportSummaryUseCase,
  getReportSummaryShiftsUseCase,
  getReportSummaryData,
  getSummaryEntries,
  formatShiftLabel,
} from '../feature/report'
import { TrendingUp, Clock, Calendar, Eraser } from 'lucide-react'
import './Inicio.css'

export default function Inicio() {
  const [loading, setLoading] = useState(true)
  const [currentShift, setCurrentShift] = useState(null)
  const [currentSummary, setCurrentSummary] = useState(null)
  const [previousShiftsEntries, setPreviousShiftsEntries] = useState([])
  const [error, setError] = useState(null)
  const [fechaDia, setFechaDia] = useState('')

  const loadDashboard = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [currentRes, shiftsRes] = await Promise.all([
        getCurrentShiftUseCase().catch(() => ({ success: false, data: null })),
        getReportSummaryShiftsUseCase(12),
      ])

      const shiftData = currentRes?.data ?? null
      setCurrentShift(shiftData)

      if (shiftData?.id) {
        try {
          const summaryRes = await getReportSummaryUseCase(shiftData.id)
          const data = getReportSummaryData(summaryRes)
          setCurrentSummary(data)
        } catch {
          setCurrentSummary(null)
        }
      } else {
        setCurrentSummary(null)
      }

      const shiftsData = getReportSummaryData(shiftsRes)
      const entries = getSummaryEntries(shiftsData ?? {})
      setPreviousShiftsEntries(entries)
    } catch (err) {
      setError(err?.message ?? 'Error al cargar el resumen')
      setCurrentShift(null)
      setCurrentSummary(null)
      setPreviousShiftsEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const formatPeso = (n) => `$${Number(n).toLocaleString('es-CO')}`

  const entriesFiltradas = useMemo(() => {
    if (!fechaDia) return previousShiftsEntries.slice(-60)
    const diaSel = fechaDia
    return previousShiftsEntries.filter((e) => {
      const start = e?.shift?.start_at ? new Date(e.shift.start_at) : null
      if (!start) return false
      const y = start.getFullYear()
      const m = String(start.getMonth() + 1).padStart(2, '0')
      const d = String(start.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}` === diaSel
    }).slice(-60)
  }, [previousShiftsEntries, fechaDia])

  const tieneFiltroFechas = Boolean(fechaDia)

  const resumenParaCards = useMemo(() => {
    if (!tieneFiltroFechas) return null
    const ventas = entriesFiltradas.reduce((s, e) => s + (e.total_ventas ?? 0), 0)
    const ingresos = entriesFiltradas.reduce((s, e) => s + (e.total_ingresos ?? 0), 0)
    const egresos = entriesFiltradas.reduce((s, e) => s + (e.total_egresos ?? 0), 0)
    return {
      total_ventas: ventas,
      total_ingresos: ingresos,
      total_egresos: egresos,
      turnosCount: entriesFiltradas.length,
    }
  }, [tieneFiltroFechas, entriesFiltradas])

  const chartData = entriesFiltradas
    .map((e, i) => ({
      id: i,
      nombre: formatShiftLabel(e.shift),
      corto: formatShiftLabel(e.shift).slice(0, 22) + (formatShiftLabel(e.shift).length > 22 ? '…' : ''),
      ventas: e.total_ventas ?? 0,
      ingresos: e.total_ingresos ?? 0,
      egresos: e.total_egresos ?? 0,
    }))
    .reverse()
    .map((row, i) => ({ ...row, id: i }))

  if (loading) {
    return (
      <PageModule title="Inicio" description="Resumen de tu Sistema POS.">
        <div className="dashboard-loading">
          <div className="dashboard-skeleton-card" />
          <div className="dashboard-skeleton-card" />
          <div className="dashboard-skeleton-chart" />
        </div>
      </PageModule>
    )
  }

  return (
    <PageModule
      title="Inicio"
      description="Resumen del turno actual y visualización de turnos anteriores."
    >
      {error && (
        <p className="dashboard-error" role="alert">
          {error}
        </p>
      )}

      <section className="dashboard-section">
        <h2 className="dashboard-section-title">
          <Clock size={20} />
          {tieneFiltroFechas ? 'Resumen del período seleccionado' : 'Turno actual'}
        </h2>
        <div className="dashboard-cards">
          <div className="dashboard-card dashboard-card--ventas">
            <h4>{tieneFiltroFechas ? 'Ventas del período' : 'Ventas del turno'}</h4>
            <p className="dashboard-value">
              {resumenParaCards
                ? formatPeso(resumenParaCards.total_ventas ?? 0)
                : currentSummary
                  ? formatPeso(currentSummary.total_ventas ?? 0)
                  : '—'}
            </p>
            <span className="dashboard-label">
              {resumenParaCards
                ? `${resumenParaCards.turnosCount} turno${resumenParaCards.turnosCount !== 1 ? 's' : ''} en el período`
                : currentShift
                  ? (currentSummary?.sales_count ?? 0) + ' ventas'
                  : 'Sin turno abierto'}
            </span>
          </div>
          <div className="dashboard-card dashboard-card--ingresos">
            <h4>{tieneFiltroFechas ? 'Ingresos del período' : 'Ingresos del turno'}</h4>
            <p className="dashboard-value">
              {resumenParaCards
                ? formatPeso(resumenParaCards.total_ingresos ?? 0)
                : currentSummary
                  ? formatPeso(currentSummary.total_ingresos ?? 0)
                  : '—'}
            </p>
            <span className="dashboard-label">
              {resumenParaCards
                ? 'Ingresos del período'
                : currentShift
                  ? 'Ingresos registrados'
                  : 'Abre un turno en Turnos'}
            </span>
          </div>
          <div className="dashboard-card dashboard-card--egresos">
            <h4>{tieneFiltroFechas ? 'Egresos del período' : 'Egresos del turno'}</h4>
            <p className="dashboard-value">
              {resumenParaCards
                ? formatPeso(resumenParaCards.total_egresos ?? 0)
                : currentSummary
                  ? formatPeso(currentSummary.total_egresos ?? 0)
                  : '—'}
            </p>
            <span className="dashboard-label">
              {resumenParaCards
                ? 'Egresos del período'
                : currentShift
                  ? 'Egresos registrados'
                  : '—'}
            </span>
          </div>
        </div>
        {!currentShift && !tieneFiltroFechas && (
          <p className="dashboard-hint">
            <Link to="/app/turnos">Abrir un turno</Link> para registrar ventas, ingresos y egresos.
          </p>
        )}
      </section>

      {(previousShiftsEntries.length > 0 || fechaDia) && (
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">
            <TrendingUp size={20} />
            Turnos anteriores
            {chartData.length > 0 && (
              <span className="dashboard-chart-subtitle">(últimos {chartData.length} turnos)</span>
            )}
          </h2>
          <div className="dashboard-filtro-fechas">
            <Calendar size={18} style={{ color: '#0d9488', flexShrink: 0 }} />
            <label className="dashboard-filtro-label">
              <span>Día de inicio del turno</span>
              <input
                type="date"
                value={fechaDia}
                onChange={(e) => setFechaDia(e.target.value)}
                className="dashboard-filtro-input"
                aria-label="Día de inicio del turno"
              />
            </label>
            <button
              type="button"
              className="dashboard-filtro-limpiar"
              onClick={() => setFechaDia('')}
              title="Quitar filtro de fecha"
              aria-label="Quitar filtro de fecha"
            >
              <Eraser size={16} /> Limpiar
            </button>
          </div>
          {chartData.length === 0 ? (
            <div className="dashboard-chart-wrap">
              <p className="dashboard-empty-filtro">
                {fechaDia
                  ? 'No hay turnos que hayan iniciado en la fecha seleccionada. Elige otro día o quita el filtro.'
                  : 'No hay turnos anteriores en los últimos 12 meses.'}
              </p>
            </div>
          ) : (
          <div className="dashboard-chart-wrap dashboard-chart-wrap--scroll">
            <div
              className="dashboard-chart-inner"
              style={{ height: Math.min(480, Math.max(280, chartData.length * 44)) }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 16, right: 24, left: 8, bottom: 16 }}
                  layout="vertical"
                  barGap={4}
                  barCategoryGap={12}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={formatPeso} fontSize={12} tick={{ fill: '#6b7280' }} />
                  <YAxis
                    type="category"
                    dataKey="id"
                    width={160}
                    tick={{ fontSize: 11, fill: '#374151' }}
                    tickFormatter={(id) => {
                      const row = chartData.find((d) => d.id === id)
                      return row ? row.corto : String(id)
                    }}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const row = payload[0]?.payload
                      if (!row || typeof row.ventas === 'undefined') return null
                      return (
                        <div className="dashboard-tooltip">
                          <div className="dashboard-tooltip-title">{row.nombre}</div>
                          <div className="dashboard-tooltip-row dashboard-tooltip-ventas">
                            <span>Ventas</span>
                            <strong>{formatPeso(row.ventas)}</strong>
                          </div>
                          <div className="dashboard-tooltip-row dashboard-tooltip-ingresos">
                            <span>Ingresos</span>
                            <strong>{formatPeso(row.ingresos)}</strong>
                          </div>
                          <div className="dashboard-tooltip-row dashboard-tooltip-egresos">
                            <span>Egresos</span>
                            <strong>{formatPeso(row.egresos)}</strong>
                          </div>
                        </div>
                      )
                    }}
                    cursor={{ fill: 'rgba(13, 148, 136, 0.08)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 12 }} iconType="circle" iconSize={8} fontSize={12} />
                  <Bar dataKey="ventas" name="Ventas" fill="#0d9488" radius={[0, 4, 4, 0]} maxBarSize={28} />
                  <Bar dataKey="ingresos" name="Ingresos" fill="#059669" radius={[0, 4, 4, 0]} maxBarSize={28} />
                  <Bar dataKey="egresos" name="Egresos" fill="#dc2626" radius={[0, 4, 4, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}
        </section>
      )}
    </PageModule>
  )
}
