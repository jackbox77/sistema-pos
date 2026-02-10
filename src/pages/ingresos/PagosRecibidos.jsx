import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function PagosRecibidos() {
  return (
    <PageModule
      title="Pagos recibidos"
      description="Registra y consulta los pagos que han realizado tus clientes."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Registrar pago</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todos los pagos</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Nº Pago</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Método</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Nº Pago">PAG-001</td>
            <td data-label="Cliente">Distribuidora López S.A.S.</td>
            <td data-label="Fecha">05/02/2026</td>
            <td data-label="Monto">$1.250.000</td>
            <td data-label="Método">Transferencia</td>
          </tr>
          <tr>
            <td data-label="Nº Pago">PAG-002</td>
            <td data-label="Cliente">Supermercado Central</td>
            <td data-label="Fecha">03/02/2026</td>
            <td data-label="Monto">$800.000</td>
            <td data-label="Método">Efectivo</td>
          </tr>
          <tr>
            <td data-label="Nº Pago">PAG-003</td>
            <td data-label="Cliente">Tienda El Ahorro</td>
            <td data-label="Fecha">02/02/2026</td>
            <td data-label="Monto">$350.000</td>
            <td data-label="Método">Tarjeta débito</td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
