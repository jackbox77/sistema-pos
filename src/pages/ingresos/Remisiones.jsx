import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function Remisiones() {
  return (
    <PageModule
      title="Remisiones"
      description="Documentos de entrega y remisión de mercancía a clientes."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nueva remisión</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todas las remisiones</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Nº Remisión</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Nº Remisión">REM-001</td>
            <td data-label="Cliente">Distribuidora López S.A.S.</td>
            <td data-label="Fecha">05/02/2026</td>
            <td data-label="Productos">15 productos</td>
            <td data-label="Estado"><span className="badge badge-success">Entregada</span></td>
          </tr>
          <tr>
            <td data-label="Nº Remisión">REM-002</td>
            <td data-label="Cliente">Supermercado Central</td>
            <td data-label="Fecha">04/02/2026</td>
            <td data-label="Productos">8 productos</td>
            <td data-label="Estado"><span className="badge badge-pending">En tránsito</span></td>
          </tr>
          <tr>
            <td data-label="Nº Remisión">REM-003</td>
            <td data-label="Cliente">Tienda El Ahorro</td>
            <td data-label="Fecha">03/02/2026</td>
            <td data-label="Productos">5 productos</td>
            <td data-label="Estado"><span className="badge badge-success">Entregada</span></td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
