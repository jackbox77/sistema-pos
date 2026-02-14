import { Link } from 'react-router-dom'
import PageModule from '../components/PageModule/PageModule'

export default function Inicio() {
  return (
    <PageModule
      title="Inicio"
      description="Resumen de tu Sistema POS. Selecciona un módulo en el menú lateral para comenzar."
    >
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h4>Ventas del día</h4>
          <p className="dashboard-value">$0</p>
          <span className="dashboard-label">Sin ventas registradas</span>
        </div>
        <div className="dashboard-card">
          <h4>Facturas pendientes</h4>
          <p className="dashboard-value">0</p>
          <span className="dashboard-label">Por cobrar</span>
        </div>
        <div className="dashboard-card">
          <h4>Pagos pendientes</h4>
          <p className="dashboard-value">0</p>
          <span className="dashboard-label">Por pagar</span>
        </div>
      </div>
      <div className="dashboard-quick-actions">
        <h4>Acciones rápidas</h4>
        <div className="quick-actions-list">
          <Link to="/app/pos/facturar" className="quick-action">Nueva venta</Link>
          <Link to="/app/ingresos/factura-ventas" className="quick-action">Nueva factura</Link>
          <Link to="/app/ingresos/pagos-recibidos" className="quick-action">Registrar pago</Link>
        </div>
      </div>
    </PageModule>
  )
}
