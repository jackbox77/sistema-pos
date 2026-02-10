import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Devoluciones() {
  return (
    <PageModule
      title="Devoluciones"
      description="Gestiona las devoluciones de productos y facturas de ajuste."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nueva devolución</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todas las devoluciones</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Nº Devolución</th>
            <th>Factura origen</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Nº Devolución">DEV-001</td>
            <td data-label="Factura origen">FV-002</td>
            <td data-label="Cliente">Tienda El Ahorro</td>
            <td data-label="Fecha">04/02/2026</td>
            <td data-label="Monto">$120.000</td>
          </tr>
          <tr>
            <td data-label="Nº Devolución">DEV-002</td>
            <td data-label="Factura origen">FV-001</td>
            <td data-label="Cliente">Distribuidora López S.A.S.</td>
            <td data-label="Fecha">01/02/2026</td>
            <td data-label="Monto">$45.000</td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
