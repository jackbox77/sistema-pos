import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function HistorialVentas() {
  return (
    <PageModule
      title="Historial de ventas"
      description="Consulta el historial completo de ventas realizadas en el punto de venta."
    >
      <div className="page-module-toolbar">
        <input type="date" className="input-date" />
        <input type="date" className="input-date" placeholder="Hasta" />
        <select className="input-select">
          <option>Todas las ventas</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Fecha/Hora</th>
            <th>Ticket</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Vendedor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay ventas registradas. El historial aparecerá aquí.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
