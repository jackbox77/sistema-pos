import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Activos() {
  return (
    <PageModule
      title="Activos"
      description="Registro y control de los activos fijos e intangibles de la empresa."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo activo</button>
        <select className="input-select">
          <option>Todos los activos</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Valor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay activos registrados. Registra los bienes de tu empresa.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
