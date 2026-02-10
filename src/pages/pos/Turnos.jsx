import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Turnos() {
  return (
    <PageModule
      title="Turnos inicio y fin"
      description="Gestiona el inicio y cierre de turnos de caja. Cada turno registra las ventas del período."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">Iniciar turno</button>
        <button className="btn-secondary">Cerrar turno</button>
        <select className="input-select">
          <option>Turnos del día</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Ventas</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay turnos registrados. Inicia un turno para comenzar a vender.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
