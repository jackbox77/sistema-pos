import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Categorias() {
  return (
    <PageModule
      title="Categorías"
      description="Ver, crear, editar y eliminar categorías. Búsqueda rápida y filtrado. Asociación con productos."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nueva categoría</button>
        <input type="search" className="input-search" placeholder="Buscar categorías..." />
        <select className="input-select">
          <option>Todas las categorías</option>
        </select>
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Productos asociados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Código">CAT-001</td>
              <td data-label="Nombre">Alimentos</td>
              <td data-label="Descripción">Productos alimenticios</td>
              <td data-label="Productos asociados">12</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
                <button className="btn-action btn-action-danger">Eliminar</button>
              </td>
            </tr>
            <tr>
              <td data-label="Código">CAT-002</td>
              <td data-label="Nombre">Bebidas</td>
              <td data-label="Descripción">Bebidas y refrescos</td>
              <td data-label="Productos asociados">8</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
                <button className="btn-action btn-action-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
