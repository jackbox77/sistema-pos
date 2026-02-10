import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Pagos() {
  return (
    <PageModule
      title="Pagos"
      description="Registra los pagos realizados a proveedores y acreedores."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Registrar pago</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todos los pagos</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Nº Pago</th>
            <th>Beneficiario</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Método</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay pagos registrados. Los pagos realizados aparecerán aquí.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
