import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function FacturasCompras() {
  return (
    <PageModule
      title="Facturas de compras"
      description="Registra y consulta las facturas de proveedores y compras realizadas."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nueva factura de compra</button>
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
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay facturas de compra. Registra las facturas de tus proveedores.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
