import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function RolesUsuarios() {
  return (
    <PageModule
      title="Roles y usuarios"
      description="Gestiona los usuarios del sistema y sus permisos por rol."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo usuario</button>
        <button className="btn-secondary">+ Nuevo rol</button>
        <select className="input-select">
          <option>Todos los usuarios</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Último acceso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay usuarios registrados. Añade usuarios para que puedan acceder al sistema.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
