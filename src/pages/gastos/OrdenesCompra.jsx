import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function OrdenesCompra() {
  return (
    <PageModule
      title="Órdenes de compra"
      description="Crea y sigue las órdenes de compra enviadas a proveedores."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nueva orden de compra</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todas las órdenes</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Nº Orden</th>
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
                No hay órdenes de compra. Crea una orden para solicitar mercancía a proveedores.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
