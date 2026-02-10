import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Productos() {
  return (
    <PageModule
      title="Productos"
      description="Ver, crear, editar y eliminar productos. Búsqueda rápida y filtrado. Asociación a categorías, impuestos y proveedores. Visualización optimizada para POS."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo producto</button>
        <input type="search" className="input-search" placeholder="Buscar productos..." />
        <select className="input-select">
          <option>Todas las categorías</option>
        </select>
        <select className="input-select">
          <option>Todos los proveedores</option>
        </select>
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Impuesto</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Código">PROD-001</td>
              <td data-label="Nombre">Arroz 1kg</td>
              <td data-label="Categoría">Alimentos</td>
              <td data-label="Precio">$3.500</td>
              <td data-label="Impuesto">IVA 19%</td>
              <td data-label="Proveedor">Distribuidora Central</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
                <button className="btn-action btn-action-danger">Eliminar</button>
              </td>
            </tr>
            <tr>
              <td data-label="Código">PROD-002</td>
              <td data-label="Nombre">Gaseosa 400ml</td>
              <td data-label="Categoría">Bebidas</td>
              <td data-label="Precio">$2.200</td>
              <td data-label="Impuesto">IVA 19%</td>
              <td data-label="Proveedor">Bebidas y Más</td>
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
