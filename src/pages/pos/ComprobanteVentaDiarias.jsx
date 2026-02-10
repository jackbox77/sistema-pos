import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function ComprobanteVentaDiarias() {
  return (
    <PageModule
      title="Comprobante de venta diarias"
      description="Genera y consulta los comprobantes de venta diarias por turno."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">Generar comprobante</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todos los turnos</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Turno</th>
            <th>Ventas totales</th>
            <th>Efectivo</th>
            <th>Otros medios</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay comprobantes. Genera el comprobante de cierre del turno.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
