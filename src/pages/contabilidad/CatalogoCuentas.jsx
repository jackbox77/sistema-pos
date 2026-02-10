import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function CatalogoCuentas() {
  return (
    <PageModule
      title="Catálogo de cuentas"
      description="Plan de cuentas contables para clasificar las transacciones."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nueva cuenta</button>
        <select className="input-select">
          <option>Todas las cuentas</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cuenta</th>
            <th>Tipo</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4">
              <div className="page-module-empty">
                No hay cuentas en el catálogo. Define el plan de cuentas de tu empresa.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
