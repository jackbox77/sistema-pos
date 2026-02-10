import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Proveedores() {
  return (
    <PageModule
      title="Proveedores"
      description="Registro y edición de proveedores. Visualización de compras asociadas a cada proveedor."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo proveedor</button>
        <input type="search" className="input-search" placeholder="Buscar proveedores..." />
      </div>
      <TableResponsive>
        <table className="page-module-table">
          <thead>
            <tr>
              <th>NIT</th>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Compras asociadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="NIT">900.123.456-1</td>
              <td data-label="Nombre">Distribuidora Central S.A.S.</td>
              <td data-label="Contacto">Juan Pérez</td>
              <td data-label="Teléfono">300 123 4567</td>
              <td data-label="Compras asociadas">24</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
                <button className="btn-action">Ver compras</button>
              </td>
            </tr>
            <tr>
              <td data-label="NIT">900.789.012-3</td>
              <td data-label="Nombre">Bebidas y Más Ltda.</td>
              <td data-label="Contacto">María López</td>
              <td data-label="Teléfono">310 987 6543</td>
              <td data-label="Compras asociadas">15</td>
              <td data-label="Acciones">
                <button className="btn-action">Editar</button>
                <button className="btn-action">Ver compras</button>
              </td>
            </tr>
          </tbody>
        </table>
      </TableResponsive>
    </PageModule>
  )
}
