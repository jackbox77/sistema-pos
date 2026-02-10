import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function LibroDiario() {
  return (
    <PageModule
      title="Libro diario"
      description="Registro cronológico de todas las transacciones contables del negocio."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo asiento</button>
        <input type="date" className="input-date" />
        <input type="date" className="input-date" placeholder="Hasta" />
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cuenta</th>
            <th>Descripción</th>
            <th>Débito</th>
            <th>Crédito</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay asientos en el libro diario. Registra las transacciones contables.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
