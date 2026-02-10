import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Impuestos() {
  return (
    <PageModule
      title="Impuestos"
      description="Creación y edición de impuestos."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo impuesto</button>
        <input type="search" className="input-search" placeholder="Buscar impuestos..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Porcentaje</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Código">IVA-19</td>
              <td data-label="Nombre">IVA</td>
              <td data-label="Porcentaje">19%</td>
              <td data-label="Descripción">Impuesto al valor agregado</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
              </td>
            </tr>
            <tr>
              <td data-label="Código">IVA-0</td>
              <td data-label="Nombre">Exento</td>
              <td data-label="Porcentaje">0%</td>
              <td data-label="Descripción">Productos exentos de IVA</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
