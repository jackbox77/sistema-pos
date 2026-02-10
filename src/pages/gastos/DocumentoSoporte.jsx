import PageModule from '../../components/PageModule/PageModule'
import TableResponsive from '../../components/TableResponsive/TableResponsive'
import '../../components/TableResponsive/TableResponsive.css'

export default function DocumentoSoporte() {
  return (
    <PageModule
      title="Documento soporte"
      description="Documentos que respaldan gastos y compras sin factura (comprobantes, recibos, etc.)."
    >
      <div className="page-module-toolbar">
        <button className="btn-primary">+ Nuevo documento soporte</button>
        <input type="date" className="input-date" />
        <select className="input-select">
          <option>Todos los documentos</option>
        </select>
      </div>
      <TableResponsive>
      <table className="page-module-table">
        <thead>
          <tr>
            <th>Nº Documento</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Proveedor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="page-module-empty">
                No hay documentos soporte. Añade documentos para respaldar tus gastos.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </TableResponsive>
    </PageModule>
  )
}
