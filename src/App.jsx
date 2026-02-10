import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Inicio from './pages/Inicio'
import PosLayout from './pages/pos/PosLayout'
import HistorialVentas from './pages/pos/HistorialVentas'
import ComprobanteVentaDiarias from './pages/pos/ComprobanteVentaDiarias'
import Turnos from './pages/pos/Turnos'
import Facturar from './pages/pos/Facturar'
import FacturaElectronica from './pages/FacturaElectronica'
import FacturaVentas from './pages/ingresos/FacturaVentas'
import PagosRecibidos from './pages/ingresos/PagosRecibidos'
import Devoluciones from './pages/ingresos/Devoluciones'
import Remisiones from './pages/ingresos/Remisiones'
import FacturasCompras from './pages/gastos/FacturasCompras'
import DocumentoSoporte from './pages/gastos/DocumentoSoporte'
import Pagos from './pages/gastos/Pagos'
import OrdenesCompra from './pages/gastos/OrdenesCompra'
import LibroDiario from './pages/contabilidad/LibroDiario'
import Activos from './pages/contabilidad/Activos'
import CatalogoCuentas from './pages/contabilidad/CatalogoCuentas'
import InformacionEmpresa from './pages/configuracion/InformacionEmpresa'
import Subscripciones from './pages/configuracion/Subscripciones'
import RolesUsuarios from './pages/nomina/RolesUsuarios'
import Categorias from './pages/maestros/Categorias'
import Productos from './pages/maestros/Productos'
import Proveedores from './pages/maestros/Proveedores'
import ClientesFidelizados from './pages/maestros/ClientesFidelizados'
import Impuestos from './pages/maestros/Impuestos'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="pos" element={<PosLayout />}>
          <Route index element={<Navigate to="ingresos/historial-ventas" replace />} />
          <Route path="ingresos/historial-ventas" element={<HistorialVentas />} />
          <Route path="ingresos/comprobante-venta-diarias" element={<ComprobanteVentaDiarias />} />
          <Route path="turnos" element={<Turnos />} />
          <Route path="facturar" element={<Facturar />} />
        </Route>
        <Route path="factura-electronica" element={<FacturaElectronica />} />
        <Route path="maestros" element={<Navigate to="/maestros/categorias" replace />} />
        <Route path="maestros/categorias" element={<Categorias />} />
        <Route path="maestros/productos" element={<Productos />} />
        <Route path="maestros/proveedores" element={<Proveedores />} />
        <Route path="maestros/clientes-fidelizados" element={<ClientesFidelizados />} />
        <Route path="maestros/impuestos" element={<Impuestos />} />
        <Route path="ingresos/factura-ventas" element={<FacturaVentas />} />
        <Route path="ingresos/pagos-recibidos" element={<PagosRecibidos />} />
        <Route path="ingresos/devoluciones" element={<Devoluciones />} />
        <Route path="ingresos/remisiones" element={<Remisiones />} />
        <Route path="gastos/facturas-compras" element={<FacturasCompras />} />
        <Route path="gastos/documento-soporte" element={<DocumentoSoporte />} />
        <Route path="gastos/pagos" element={<Pagos />} />
        <Route path="gastos/ordenes-compra" element={<OrdenesCompra />} />
        <Route path="contabilidad/libro-diario" element={<LibroDiario />} />
        <Route path="contabilidad/activos" element={<Activos />} />
        <Route path="contabilidad/catalogo-cuentas" element={<CatalogoCuentas />} />
        <Route path="configuracion/informacion-empresa" element={<InformacionEmpresa />} />
        <Route path="configuracion/subscripciones" element={<Subscripciones />} />
        <Route path="nomina" element={<Navigate to="/nomina/roles-usuarios" replace />} />
        <Route path="nomina/roles-usuarios" element={<RolesUsuarios />} />
      </Route>
    </Routes>
  )
}
