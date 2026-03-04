import { useState, useEffect, useCallback, useMemo } from 'react'
import PageModule from '../../components/PageModule/PageModule'
import '../../components/FormularioProductos/FormularioProductos.css'
import { getShiftsUseCase } from '../../feature/shifts/use-case'
import {
  getReportSummaryShiftsUseCase,
  getReportSummaryUseCase,
  getReportSummaryByIntervalUseCase,
  getReportSummaryData,
  isSummaryByShift,
  getSummaryEntries,
  formatShiftLabel,
} from '../../feature/report'
import './Reportes.css'

function formatShiftShortDate(shift) {
  if (!shift?.start_at) return ''
  const d = new Date(shift.start_at)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-CO', { dateStyle: 'short' })
}

/** Turnos ordenados por start_at ascendente (el más antiguo primero) */
function turnosOrdenadosPorFecha(turnos) {
  return [...turnos].sort((a, b) => {
    const ta = a.start_at ? new Date(a.start_at).getTime() : 0
    const tb = b.start_at ? new Date(b.start_at).getTime() : 0
    return ta - tb
  })
}

/** true si el turno empezó en la fecha local YYYY-MM-DD */
function turnoEnFecha(shift, dateStr) {
  if (!dateStr || !shift?.start_at) return true
  const d = new Date(shift.start_at)
  if (isNaN(d.getTime())) return false
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}` === dateStr
}

/** Filtra por fecha (opcional) y por texto; mantiene el turno seleccionado en la lista */
function filtrarTurnos(turnos, texto, seleccionadoId, fechaStr = '') {
  let lista = turnos
  if (fechaStr) {
    lista = lista.filter((t) => turnoEnFecha(t, fechaStr))
  }
  const q = texto.trim().toLowerCase()
  if (!q) return lista
  const seleccionado = seleccionadoId ? turnos.find((t) => t.id === seleccionadoId) : null
  const filtrados = lista.filter((t) => formatShiftLabel(t).toLowerCase().includes(q))
  if (seleccionado && !filtrados.some((t) => t.id === seleccionadoId) && turnoEnFecha(seleccionado, fechaStr)) {
    return [seleccionado, ...filtrados]
  }
  return filtrados
}

/** Tipo de reporte (enum) */
export const TIPO_REPORTE = {
  ULTIMOS_MESES: 'ultimos_meses',
  REPORTE_UN_TURNO: 'reporte_un_turno',
  REPORTE_INTERVALOS_DOS_TURNOS: 'reporte_intervalos_dos_turnos',
}

const TIPOS_REPORTE_OPCIONES = [
  { value: TIPO_REPORTE.ULTIMOS_MESES, label: 'Últimos meses' },
  { value: TIPO_REPORTE.REPORTE_UN_TURNO, label: 'Reporte de un turno' },
  { value: TIPO_REPORTE.REPORTE_INTERVALOS_DOS_TURNOS, label: 'Reporte de intervalos de dos turnos' },
]

export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState(TIPO_REPORTE.ULTIMOS_MESES)
  const [ultimosMeses, setUltimosMeses] = useState(1)
  const [turnos, setTurnos] = useState([])
  const [loadingTurnos, setLoadingTurnos] = useState(false)
  const [turnoId, setTurnoId] = useState('')
  const [turnoInicioId, setTurnoInicioId] = useState('')
  const [turnoFinId, setTurnoFinId] = useState('')
  const [errorIntervalo, setErrorIntervalo] = useState('')
  const [filtroTurno, setFiltroTurno] = useState('')
  const [filtroTurnoUnico, setFiltroTurnoUnico] = useState('')
  const [filtroFechaUnico, setFiltroFechaUnico] = useState('')
  const [filtroFechaIntervalo, setFiltroFechaIntervalo] = useState('')
  const [loadingReporte, setLoadingReporte] = useState(false)
  const [errorReporte, setErrorReporte] = useState('')
  const [resultadoReporte, setResultadoReporte] = useState(null)

  const cargarTurnos = useCallback(async () => {
    setLoadingTurnos(true)
    try {
      const res = await getShiftsUseCase(1, 500)
      if (res?.success && res?.data?.data) {
        setTurnos(res.data.data)
        if (res.data.data.length > 0) setTurnoId(res.data.data[0].id)
      } else {
        setTurnos([])
      }
    } catch {
      setTurnos([])
    } finally {
      setLoadingTurnos(false)
    }
  }, [])

  useEffect(() => {
    if (tipoReporte === TIPO_REPORTE.REPORTE_INTERVALOS_DOS_TURNOS && turnos.length >= 2 && !turnoInicioId) {
      const ordenados = turnosOrdenadosPorFecha(turnos)
      setTurnoInicioId(ordenados[0].id)
      setTurnoFinId(ordenados[1].id)
    }
  }, [tipoReporte, turnos, turnoInicioId])

  useEffect(() => {
    if (tipoReporte === TIPO_REPORTE.REPORTE_UN_TURNO || tipoReporte === TIPO_REPORTE.REPORTE_INTERVALOS_DOS_TURNOS) {
      cargarTurnos()
    } else {
      setTurnoId('')
      setTurnoInicioId('')
      setTurnoFinId('')
      setFiltroTurno('')
      setFiltroTurnoUnico('')
      setFiltroFechaUnico('')
      setFiltroFechaIntervalo('')
    }
  }, [tipoReporte, cargarTurnos])

  const turnosOrdenados = useMemo(() => turnosOrdenadosPorFecha(turnos), [turnos])
  const turnoInicio = turnos.find((t) => t.id === turnoInicioId)
  const turnoFin = turnos.find((t) => t.id === turnoFinId)
  const turnoInicioFecha = turnoInicio?.start_at ? new Date(turnoInicio.start_at).getTime() : 0
  const turnosParaFin = useMemo(
    () => turnosOrdenados.filter((t) => (t.start_at ? new Date(t.start_at).getTime() : 0) > turnoInicioFecha),
    [turnosOrdenados, turnoInicioFecha]
  )

  const turnosFiltradosUnico = useMemo(
    () => filtrarTurnos(turnos, filtroTurnoUnico, turnoId, filtroFechaUnico),
    [turnos, filtroTurnoUnico, turnoId, filtroFechaUnico]
  )
  const turnosOrdenadosFiltrados = useMemo(
    () => filtrarTurnos(turnosOrdenados, filtroTurno, turnoInicioId, filtroFechaIntervalo),
    [turnosOrdenados, filtroTurno, turnoInicioId, filtroFechaIntervalo]
  )
  const turnosParaFinFiltrados = useMemo(
    () => filtrarTurnos(turnosParaFin, filtroTurno, turnoFinId, filtroFechaIntervalo),
    [turnosParaFin, filtroTurno, turnoFinId, filtroFechaIntervalo]
  )

  const puedeGenerar = useMemo(() => {
    if (tipoReporte === TIPO_REPORTE.ULTIMOS_MESES) return ultimosMeses >= 1
    if (tipoReporte === TIPO_REPORTE.REPORTE_UN_TURNO) return !loadingTurnos && !!turnoId
    if (tipoReporte === TIPO_REPORTE.REPORTE_INTERVALOS_DOS_TURNOS) {
      if (!turnoInicioId || !turnoFinId) return false
      const fi = turnoInicio?.start_at ? new Date(turnoInicio.start_at).getTime() : 0
      const ff = turnoFin?.start_at ? new Date(turnoFin.start_at).getTime() : 0
      return fi < ff
    }
    return false
  }, [tipoReporte, ultimosMeses, loadingTurnos, turnoId, turnoInicioId, turnoFinId, turnoInicio, turnoFin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorIntervalo('')
    setErrorReporte('')
    setResultadoReporte(null)
    if (tipoReporte === TIPO_REPORTE.REPORTE_INTERVALOS_DOS_TURNOS) {
      if (!turnoInicioId || !turnoFinId) {
        setErrorIntervalo('Selecciona el turno inicial y el turno final.')
        return
      }
      const fechaInicio = turnoInicio?.start_at ? new Date(turnoInicio.start_at).getTime() : 0
      const fechaFin = turnoFin?.start_at ? new Date(turnoFin.start_at).getTime() : 0
      if (fechaInicio >= fechaFin) {
        setErrorIntervalo('El turno inicial debe tener una fecha anterior al turno final.')
        return
      }
    }
    setLoadingReporte(true)
    try {
      let res
      if (tipoReporte === TIPO_REPORTE.ULTIMOS_MESES) {
        res = await getReportSummaryShiftsUseCase(ultimosMeses)
      } else if (tipoReporte === TIPO_REPORTE.REPORTE_UN_TURNO) {
        res = await getReportSummaryUseCase(turnoId)
      } else {
        res = await getReportSummaryByIntervalUseCase(turnoInicioId, turnoFinId)
      }
      const data = getReportSummaryData(res)
      if (data) {
        setResultadoReporte(data)
      } else {
        setErrorReporte(res?.message ?? 'No se pudo obtener el reporte.')
      }
    } catch (err) {
      setErrorReporte(err?.message ?? 'Error al generar el reporte.')
    } finally {
      setLoadingReporte(false)
    }
  }

  return (
    <PageModule
      title="Reportes"
      description="Consulta y descarga reportes de ventas, inventario y operaciones."
    >
      <form onSubmit={handleSubmit} className="reportes-wrap">
        <div className="reportes-card">
          <h2 className="reportes-card-titulo">Tipo de reporte</h2>
          <div className="reportes-field">
            <label htmlFor="reportes-tipo">¿Qué reporte necesitas?</label>
            <select
              id="reportes-tipo"
              className="reportes-select"
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              aria-label="Tipo de reporte"
            >
              {TIPOS_REPORTE_OPCIONES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {tipoReporte === TIPO_REPORTE.ULTIMOS_MESES && (
            <>
              <p className="reportes-tipo-desc">Ventas o datos de los últimos N meses.</p>
              <div className="reportes-field">
                <label htmlFor="reportes-meses">Último(s) mese(s)</label>
                <input
                  id="reportes-meses"
                  type="number"
                  min={1}
                  step={1}
                  value={ultimosMeses}
                  onChange={(e) => setUltimosMeses(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  aria-label="Cantidad de meses"
                />
              </div>
            </>
          )}

          {tipoReporte === TIPO_REPORTE.REPORTE_UN_TURNO && (
            <>
              <p className="reportes-tipo-desc">Datos de un solo turno. Filtra por fecha o por nombre.</p>
              <div className="reportes-filtros-row">
                <div className="reportes-field reportes-busqueda-wrap reportes-filtro-fecha">
                  <label htmlFor="reportes-fecha-unico">Fecha</label>
                  <input
                    id="reportes-fecha-unico"
                    type="date"
                    className="reportes-input-date"
                    value={filtroFechaUnico}
                    onChange={(e) => setFiltroFechaUnico(e.target.value)}
                    aria-label="Filtrar por fecha"
                  />
                </div>
                <div className="reportes-field reportes-busqueda-wrap reportes-filtro-texto">
                  <label htmlFor="reportes-busqueda-unico">Buscar por nombre</label>
                  <input
                    id="reportes-busqueda-unico"
                    type="search"
                    className="input-search"
                    placeholder="Nombre del turno..."
                    value={filtroTurnoUnico}
                    onChange={(e) => setFiltroTurnoUnico(e.target.value)}
                    aria-label="Filtrar por nombre"
                  />
                </div>
              </div>
              <p className="reportes-turnos-count" aria-live="polite">
                {loadingTurnos
                  ? 'Cargando turnos...'
                  : (filtroTurnoUnico.trim() || filtroFechaUnico)
                    ? `Mostrando ${turnosFiltradosUnico.length} de ${turnos.length} turnos`
                    : `${turnos.length} turnos`}
              </p>
              <div className="reportes-field">
                <label htmlFor="reportes-turno-unico">Turno</label>
                <select
                  id="reportes-turno-unico"
                  className="reportes-select"
                  value={turnoId}
                  onChange={(e) => setTurnoId(e.target.value)}
                  disabled={loadingTurnos}
                  aria-label="Seleccionar turno"
                >
                  <option value="">{loadingTurnos ? 'Cargando...' : 'Seleccione un turno'}</option>
                  {turnosFiltradosUnico.map((t) => (
                    <option key={t.id} value={t.id}>
                      {formatShiftLabel(t)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {tipoReporte === TIPO_REPORTE.REPORTE_INTERVALOS_DOS_TURNOS && (
            <>
              <p className="reportes-tipo-desc">Datos entre dos turnos (el primero debe ser anterior al segundo).</p>
              <div className="reportes-filtros-row">
                <div className="reportes-field reportes-busqueda-wrap reportes-filtro-fecha">
                  <label htmlFor="reportes-fecha-intervalo">Fecha</label>
                  <input
                    id="reportes-fecha-intervalo"
                    type="date"
                    className="reportes-input-date"
                    value={filtroFechaIntervalo}
                    onChange={(e) => setFiltroFechaIntervalo(e.target.value)}
                    aria-label="Filtrar por fecha"
                  />
                </div>
                <div className="reportes-field reportes-busqueda-wrap reportes-filtro-texto">
                  <label htmlFor="reportes-busqueda-intervalo">Buscar por nombre</label>
                  <input
                    id="reportes-busqueda-intervalo"
                    type="search"
                    className="input-search"
                    placeholder="Nombre del turno..."
                    value={filtroTurno}
                    onChange={(e) => setFiltroTurno(e.target.value)}
                    aria-label="Filtrar por nombre"
                  />
                </div>
              </div>
              <p className="reportes-turnos-count" aria-live="polite">
                {loadingTurnos
                  ? 'Cargando turnos...'
                  : (filtroTurno.trim() || filtroFechaIntervalo)
                    ? `Mostrando ${turnosOrdenadosFiltrados.length} / ${turnosOrdenados.length} turnos`
                    : `${turnos.length} turnos`}
              </p>
              <div className="reportes-field">
                <label htmlFor="reportes-turno-inicio">Turno inicial</label>
                <select
                  id="reportes-turno-inicio"
                  className="reportes-select"
                  value={turnoInicioId}
                  onChange={(e) => {
                    setTurnoInicioId(e.target.value)
                    setTurnoFinId('')
                  }}
                  disabled={loadingTurnos}
                  aria-label="Turno inicial (fecha anterior)"
                >
                  <option value="">{loadingTurnos ? 'Cargando...' : 'Seleccione el primer turno'}</option>
                  {turnosOrdenadosFiltrados.map((t) => (
                    <option key={t.id} value={t.id}>
                      {formatShiftLabel(t)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="reportes-field">
                <label htmlFor="reportes-turno-fin">Turno final</label>
                <select
                  id="reportes-turno-fin"
                  className="reportes-select"
                  value={turnoFinId}
                  onChange={(e) => setTurnoFinId(e.target.value)}
                  disabled={loadingTurnos || !turnoInicioId}
                  aria-label="Turno final (fecha posterior)"
                >
                  <option value="">{!turnoInicioId ? 'Primero elija el turno inicial' : 'Seleccione el segundo turno'}</option>
                  {turnosParaFinFiltrados.map((t) => (
                    <option key={t.id} value={t.id}>
                      {formatShiftLabel(t)}
                    </option>
                  ))}
                </select>
              </div>
              {turnoInicioId && turnoFinId && turnoInicio && turnoFin && (
                <p className="reportes-intervalo-resumen">
                  Del {formatShiftShortDate(turnoInicio)} al {formatShiftShortDate(turnoFin)}
                </p>
              )}
              {errorIntervalo && (
                <p className="reportes-error" role="alert">
                  {errorIntervalo}
                </p>
              )}
            </>
          )}
        </div>

        <div className="reportes-footer">
          <button
            type="submit"
            className="form-btn-primary"
            disabled={!puedeGenerar || loadingReporte}
          >
            {loadingReporte ? 'Generando...' : 'Generar reporte'}
          </button>
        </div>
      </form>

      {errorReporte && (
        <p className="reportes-error reportes-error-global" role="alert">
          {errorReporte}
        </p>
      )}

      {resultadoReporte && (
        <ResultadoReporte data={resultadoReporte} />
      )}
    </PageModule>
  )
}

function ResultadoReporte({ data }) {
  const isByShift = isSummaryByShift(data)
  const from = data?.from ?? ''
  const to = data?.to ?? ''
  const entries = getSummaryEntries(data)

  const renderTotales = (totales) => (
    <div className="reportes-kpis">
      <div className="reportes-kpi reportes-kpi-ingresos">
        <span className="reportes-kpi-label">Total ingresos</span>
        <span className="reportes-kpi-valor">${Number(totales.ingresos).toLocaleString('es-CO')}</span>
      </div>
      <div className="reportes-kpi reportes-kpi-egresos">
        <span className="reportes-kpi-label">Total egresos</span>
        <span className="reportes-kpi-valor">${Number(totales.egresos).toLocaleString('es-CO')}</span>
      </div>
      <div className="reportes-kpi reportes-kpi-ventas">
        <span className="reportes-kpi-label">Total ventas</span>
        <span className="reportes-kpi-valor">${Number(totales.ventas).toLocaleString('es-CO')}</span>
      </div>
      {totales.salesCount != null && (
        <div className="reportes-kpi reportes-kpi-count">
          <span className="reportes-kpi-label">Cantidad de ventas</span>
          <span className="reportes-kpi-valor">{totales.salesCount}</span>
        </div>
      )}
    </div>
  )

  const renderTablaTurnos = (titulo) =>
    entries.length > 0 ? (
      <div className="reportes-tabla-wrap">
        <h3 className="reportes-resultado-subtitulo">{titulo}</h3>
        <div className="reportes-tabla-scroll">
          <table className="reportes-tabla" role="grid">
            <thead>
              <tr>
                <th scope="col">Turno</th>
                <th scope="col" className="reportes-tabla-num">Ventas</th>
                <th scope="col" className="reportes-tabla-num">Ingresos</th>
                <th scope="col" className="reportes-tabla-num">Egresos</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.shift?.id ?? e.id}>
                  <td className="reportes-tabla-turno">{formatShiftLabel(e.shift || e)}</td>
                  <td className="reportes-tabla-num">${Number(e.total_ventas ?? 0).toLocaleString('es-CO')}</td>
                  <td className="reportes-tabla-num">${Number(e.total_ingresos ?? 0).toLocaleString('es-CO')}</td>
                  <td className="reportes-tabla-num">${Number(e.total_egresos ?? 0).toLocaleString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null

  if (isByShift) {
    const totalIngresos = data.total_ingresos ?? 0
    const totalEgresos = data.total_egresos ?? 0
    const totalVentas = data.total_ventas ?? 0
    const salesCount = data.sales_count ?? 0
    const shiftsCount = data.shifts_count ?? 0
    return (
      <div className="reportes-resultado">
        <div className="reportes-resultado-head">
          <h2 className="reportes-resultado-titulo">Resumen del período</h2>
          <p className="reportes-resultado-periodo">
            Del {from} al {to} · {shiftsCount} turno(s)
          </p>
        </div>
        {renderTotales({ ingresos: totalIngresos, egresos: totalEgresos, ventas: totalVentas, salesCount })}
        {renderTablaTurnos('Turnos incluidos')}
      </div>
    )
  }

  const sumIngresos = entries.reduce((a, e) => a + (e.total_ingresos ?? 0), 0)
  const sumEgresos = entries.reduce((a, e) => a + (e.total_egresos ?? 0), 0)
  const sumVentas = entries.reduce((a, e) => a + (e.total_ventas ?? 0), 0)
  return (
    <div className="reportes-resultado">
      <div className="reportes-resultado-head">
        <h2 className="reportes-resultado-titulo">Resumen últimos meses</h2>
        <p className="reportes-resultado-periodo">
          Del {from} al {to} · {entries.length} turno(s)
        </p>
      </div>
      {renderTotales({ ingresos: sumIngresos, egresos: sumEgresos, ventas: sumVentas })}
      {renderTablaTurnos('Por turno')}
    </div>
  )
}
