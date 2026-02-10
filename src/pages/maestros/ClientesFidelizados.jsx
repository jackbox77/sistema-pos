import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function ClientesFidelizados() {
  return (
    <PageModule
      title="Clientes fidelizados"
      description="Gestión de clientes fidelizados. Visualización del registro de ventas asociadas a fidelización."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo cliente fidelizado</button>
        <input type="search" className="input-search" placeholder="Buscar clientes..." />
        <select className="input-select">
          <option>Todos los niveles</option>
        </select>
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Identificación</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Puntos</th>
              <th>Ventas asociadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Identificación">1.234.567-8</td>
              <td data-label="Nombre">Carlos Rodríguez</td>
              <td data-label="Email">carlos@email.com</td>
              <td data-label="Puntos">1.250</td>
              <td data-label="Ventas asociadas">18</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
                <button className="btn-action">Ver ventas</button>
              </td>
            </tr>
            <tr>
              <td data-label="Identificación">5.678.901-2</td>
              <td data-label="Nombre">Ana Martínez</td>
              <td data-label="Email">ana@email.com</td>
              <td data-label="Puntos">890</td>
              <td data-label="Ventas asociadas">12</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
                <button className="btn-action">Ver ventas</button>
              </td>
            </tr>
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
