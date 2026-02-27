import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTurnos } from './TurnosLayout'
import { formatoTurno } from '../../utils/fechaUtils'
import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'
import './DetalleTurno.css'

export default function DetalleTurno() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { turnos } = useTurnos()

    const turno = turnos.find((t) => t.id === id)

    if (!turno) {
        return (
            <PageModule title="" description="">
                <div className="detalle-turno-empty">
                    <p>El turno solicitado no existe o no se pudo cargar.</p>
                    <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Volver</button>
                </div>
            </PageModule>
        )
    }

    const extraerFecha = (f) => (f ? (f.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || '' : '')
    const turnoAbreviado = formatoTurno(extraerFecha(turno.inicio), extraerFecha(turno.fin))

    return (
        <PageModule title="" description="">
            <header className="maestro-encabezado">
                <div className="maestro-encabezado-top">
                    <div className="maestro-encabezado-info">
                        <div className="detalle-turno-header-title">
                            <button
                                type="button"
                                className="btn-icon-action btn-back"
                                onClick={() => navigate('/app/turnos/historial')}
                                aria-label="Volver al historial"
                                title="Volver"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="maestro-encabezado-titulo">Detalle del turno</h1>
                        </div>
                        <p className="maestro-encabezado-desc">
                            Resumen financiero del turno operado por <strong>{turno.usuario}</strong> ({turnoAbreviado}).
                        </p>
                    </div>
                    <div className="maestro-encabezado-acciones">
                        <span className={`badge ${turno.estado === 'Cerrado' ? 'badge-closed' : 'badge-success'}`}>
                            Estado: {turno.estado}
                        </span>
                    </div>
                </div>
            </header>

            <div className="dashboard-cards" style={{ marginTop: '24px' }}>
                <div className="dashboard-card detalle-turno-card">
                    <h4>Ventas totales</h4>
                    <span className="dashboard-value text-success">${Number(turno.ventas || 0).toLocaleString('es-CO')}</span>
                    <span className="dashboard-label">Total recaudado</span>
                </div>
                <div className="dashboard-card detalle-turno-card">
                    <h4>Ingresos (Caja inicial + otros)</h4>
                    <span className="dashboard-value text-info">${Number(turno.ingresos || 0).toLocaleString('es-CO')}</span>
                    <span className="dashboard-label">Dinero que ingresó externo a ventas</span>
                </div>
                <div className="dashboard-card detalle-turno-card">
                    <h4>Egresos</h4>
                    <span className="dashboard-value text-danger">${Number(turno.egresos || 0).toLocaleString('es-CO')}</span>
                    <span className="dashboard-label">Gastos o salidas del turno</span>
                </div>
                <div className="dashboard-card detalle-turno-card detalle-turno-total">
                    <h4>Total en Caja</h4>
                    <span className="dashboard-value">${(Number(turno.ventas || 0) + Number(turno.ingresos || 0) - Number(turno.egresos || 0)).toLocaleString('es-CO')}</span>
                    <span className="dashboard-label">Saldo calculado al cierre</span>
                </div>
            </div>

            <div className="detalle-turno-section">
                <h3 className="detalle-turno-section-title">Información del Horario</h3>
                <TableResponsive>
                    <table className="page-module-table">
                        <thead>
                            <tr>
                                <th>Apertura</th>
                                <th>Cierre</th>
                                <th>Duración</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{turno.inicio}</td>
                                <td>{turno.fin || 'En curso'}</td>
                                <td>
                                    {turno.inicio && turno.fin
                                        ? (() => {
                                            const start = new Date(turno.start_at || turno.inicio)
                                            const end = new Date(turno.end_at || turno.fin)
                                            if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-'
                                            const diffMins = Math.floor((end.getTime() - start.getTime()) / 60000)
                                            const h = Math.floor(diffMins / 60)
                                            const m = diffMins % 60
                                            return `${h}h ${m}m`
                                        })()
                                        : '-'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </TableResponsive>
            </div>

        </PageModule>
    )
}
