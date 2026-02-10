import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function FacturaVentas() {
  return (
    <PageModule
      title="Factura de ventas"
      description="Crea, consulta y emite facturas de venta a tus clientes."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nueva factura</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todas las facturas</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Nº Factura</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Nº Factura">FV-001</td>
            <td data-label="Cliente">Distribuidora López S.A.S.</td>
            <td data-label="Fecha">05/02/2026</td>
            <td data-label="Total">$1.250.000</td>
            <td data-label="Estado"><span className="badge badge-success">Pagada</span></td>
          </tr>
          <tr>
            <td data-label="Nº Factura">FV-002</td>
            <td data-label="Cliente">Tienda El Ahorro</td>
            <td data-label="Fecha">04/02/2026</td>
            <td data-label="Total">$580.000</td>
            <td data-label="Estado"><span className="badge badge-pending">Pendiente</span></td>
          </tr>
          <tr>
            <td data-label="Nº Factura">FV-003</td>
            <td data-label="Cliente">Supermercado Central</td>
            <td data-label="Fecha">03/02/2026</td>
            <td data-label="Total">$2.100.000</td>
            <td data-label="Estado"><span className="badge badge-success">Pagada</span></td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
