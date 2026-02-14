import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Login from './pages/auth/Login'
import Registro from './pages/auth/Registro'
import ForgotPassword from './pages/auth/ForgotPassword'
import Inicio from './pages/Inicio'
import PosLayout from './pages/pos/PosLayout'
import HistorialVentas from './pages/pos/HistorialVentas'
import ComprobanteVentaDiarias from './pages/pos/ComprobanteVentaDiarias'
import PosTurnos from './pages/pos/Turnos'
import Facturar from './pages/pos/Facturar'
import FacturaElectronica from './pages/FacturaElectronica'
import IngresosLayout from './pages/ingresos/IngresosLayout'
import TurnosLayout from './pages/turnos/TurnosLayout'
import Turnos from './pages/turnos/Turnos'
import HistorialTurnos from './pages/turnos/HistorialTurnos'
import FacturaVentas from './pages/ingresos/FacturaVentas'
import Egresos from './pages/ingresos/Egresos'
import Ventas from './pages/ingresos/Ventas'
import ContabilidadLayout from './pages/contabilidad/ContabilidadLayout'
import LibroDiario from './pages/contabilidad/LibroDiario'
import Activos from './pages/contabilidad/Activos'
import CatalogoCuentas from './pages/contabilidad/CatalogoCuentas'
import Subscripciones from './pages/configuracion/Subscripciones'
import Perfil from './pages/configuracion/Perfil'
import UsuariosPermisos from './pages/configuracion/UsuariosPermisos'
import HistorialSubscripciones from './pages/configuracion/HistorialSubscripciones'
import RolesUsuarios from './pages/nomina/RolesUsuarios'
import Categorias from './pages/maestros/Categorias'
import ProductosLayout from './pages/maestros/ProductosLayout'
import ProductosList from './pages/maestros/ProductosList'
import ProductoForm from './pages/maestros/ProductoForm'
import ProveedoresLayout from './pages/maestros/ProveedoresLayout'
import ProveedoresList from './pages/maestros/ProveedoresList'
import ProveedorForm from './pages/maestros/ProveedorForm'
import ClientesFidelizados from './pages/maestros/ClientesFidelizados'
import Impuestos from './pages/maestros/Impuestos'
import MetodosPago from './pages/maestros/MetodosPago'
import MenuLayout from './pages/menu/MenuLayout'
import Menu from './pages/menu/Menu'
import MenuCategoria from './pages/menu/MenuCategoria'
import MenuProductos from './pages/menu/MenuProductos'
import VistaCompletaMenu from './pages/menu/VistaCompletaMenu'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/app" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="pos" element={<PosLayout />}>
          <Route index element={<Navigate to="/app/pos/ingresos/historial-ventas" replace />} />
          <Route path="ingresos/historial-ventas" element={<HistorialVentas />} />
          <Route path="ingresos/comprobante-venta-diarias" element={<ComprobanteVentaDiarias />} />
          <Route path="turnos" element={<PosTurnos />} />
          <Route path="facturar" element={<Facturar />} />
        </Route>
        <Route path="factura-electronica" element={<FacturaElectronica />} />
        <Route path="menu" element={<MenuLayout />}>
          <Route index element={<Menu />} />
<Route path="categoria" element={<MenuCategoria />} />
          <Route path="productos" element={<MenuProductos />} />
          <Route path="vista-completa" element={<VistaCompletaMenu />} />
        </Route>
        <Route path="maestros" element={<Navigate to="/app/maestros/categorias" replace />} />
        <Route path="maestros/categorias" element={<Categorias />} />
        <Route path="maestros/productos" element={<ProductosLayout />}>
          <Route index element={<ProductosList />} />
          <Route path="nuevo" element={<ProductoForm />} />
          <Route path="editar/:id" element={<ProductoForm />} />
        </Route>
        <Route path="maestros/proveedores" element={<ProveedoresLayout />}>
          <Route index element={<ProveedoresList />} />
          <Route path="nuevo" element={<ProveedorForm />} />
          <Route path="editar/:id" element={<ProveedorForm />} />
        </Route>
        <Route path="maestros/clientes-fidelizados" element={<ClientesFidelizados />} />
        <Route path="maestros/impuestos" element={<Impuestos />} />
        <Route path="maestros/metodos-pago" element={<MetodosPago />} />
        <Route path="ingresos" element={<IngresosLayout />}>
          <Route index element={<Navigate to="/app/ingresos/ingresos" replace />} />
          <Route path="ingresos" element={<FacturaVentas />} />
          <Route path="egresos" element={<Egresos />} />
          <Route path="ventas" element={<Ventas />} />
        </Route>
        <Route path="turnos" element={<TurnosLayout />}>
          <Route index element={<Turnos />} />
          <Route path="historial" element={<HistorialTurnos />} />
        </Route>
        <Route path="contabilidad" element={<ContabilidadLayout />}>
          <Route index element={<Navigate to="/app/contabilidad/libro-diario" replace />} />
          <Route path="libro-diario" element={<LibroDiario />} />
          <Route path="activos" element={<Activos />} />
          <Route path="catalogo-cuentas" element={<CatalogoCuentas />} />
        </Route>
        <Route path="configuracion/perfil" element={<Perfil />} />
        <Route path="configuracion/usuarios-permisos" element={<UsuariosPermisos />} />
        <Route path="configuracion/historial-subscripciones" element={<HistorialSubscripciones />} />
        <Route path="configuracion/subscripciones" element={<Subscripciones />} />
        <Route path="nomina" element={<Navigate to="/app/nomina/roles-usuarios" replace />} />
        <Route path="nomina/roles-usuarios" element={<RolesUsuarios />} />
      </Route>
    </Routes>
  )
}
