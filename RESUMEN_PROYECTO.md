# Resumen del Proyecto - Sistema POS

> **Para nuevo chat:** Copia este resumen al iniciar una conversación para que el asistente tenga contexto del proyecto.

## Descripción general
Sistema de punto de venta (POS) desarrollado con **React + Vite + React Router**. Incluye autenticación, menú digital, finanzas, turnos, configuración y maestros. No incluye módulo de inventario por decisión del usuario. Persistencia en localStorage (MaestrosContext, IngresosLayout).

---

## Estructura del menú lateral (Sidebar)

| Módulo | Submódulos |
|--------|------------|
| **Inicio** | — |
| **POS** | Historial ventas, Comprobante venta diarias, Turnos inicio y fin, Facturar |
| **Menú** | Editor de menú, Categoría, Productos, Vista completa |
| **Finanzas** | Ingresos, Egresos, Ventas |
| **Turnos** | Turnos, Historial de turnos |
| **Configuración** | Perfil, Usuarios y permisos, Historial de subscripciones, Subscripciones |
| **Maestros** | Categorías, Productos, Proveedores, Clientes fidelizados, Impuestos, Métodos de pago |

*Módulos comentados en Sidebar: Gastos, Contabilidad, Nómina (las rutas siguen disponibles).*

---

## Rutas principales

### Auth
- `/` → Login
- `/registro`, `/forgot-password`

### App (tras login)
- `/app` → Inicio
- `/app/pos` → POS (historial ventas, comprobantes, turnos POS, facturar)
- `/app/menu` → Editor de menú | `/app/menu/categoria` | `/app/menu/productos` | `/app/menu/vista-completa`
- `/app/ingresos` → Finanzas: Ingresos, Egresos, Ventas
- `/app/turnos` → Turnos, Historial de turnos
- `/app/configuracion` → Perfil, Usuarios y permisos, Historial de subscripciones, Subscripciones
- `/app/maestros` → Categorías, Productos, Proveedores, etc.
- `/app/contabilidad` → Libro diario, Activos, Catálogo de cuentas
- `/app/nomina/roles-usuarios` → Roles y usuarios

---

## Contextos y datos

### MaestrosContext
- **categorias**, **productos** con CRUD
- Persistencia en `localStorage` (maestros_categorias, maestros_productos)
- Productos tienen `categoriaId`; categorías tienen imagen, codigo, nombre, descripcion

### IngresosLayout (Finanzas)
- **facturasVentas**: facturas con numero, cliente, fecha, fechaFin (opcional), items, total, estado
- CRUD: agregarFacturaVenta, actualizarFacturaVenta, eliminarFacturaVenta

### TurnosLayout
- **turnos**: usuario, inicio, fin, ventas, estado (Abierto/Cerrado)
- CRUD: agregarTurno, actualizarTurno

### MenuContext
- Usa `useMaestros()` para categorias y productos
- **categoriasEnMenu**, **productosEnMenu** (IDs seleccionados para el menú)
- **categoriasConProductos**: categorías activas con sus items para vista previa
- Apariencia (colores), empresaInfo (logo, nombre, subtitulo, etc.), tipoMenu

---

## Estilo maestro-encabezado

Páginas con encabezado tipo Categorías (maestro-encabezado):
- **Ingresos** (FacturaVentas): título, descripción, "Ver más", Más acciones, Registrar ingreso, Lista de precios, Filtros activos
- **Egresos**, **Ventas**
- **Turnos**, **Historial de turnos**
- **Usuarios y permisos**, **Historial de subscripciones**

Columnas comunes en tablas de Finanzas: **Turno** (día o intervalo según fecha/fechaFin) — ver `formatoTurno()` en `src/utils/fechaUtils.js`.

---

## Funcionalidades por módulo

### Menú
- **Editor de menú**: info empresa, tipo de menú (Clásico, Tarjetas con barra, Categorías primero, Platos horizontal), apariencia (colores), vista previa
- **Categoría**: activar/desactivar categorías de Maestros para el menú
- **Productos**: activar/desactivar productos de Maestros para el menú (solo de categorías activas)
- **Vista completa**: menú a pantalla completa

### Finanzas
- **Ingresos**: facturas de venta con productos, CRUD, modal crear/editar
- **Egresos**: placeholder con tabla
- **Ventas**: solo lectura, muestra facturasVentas, sin editar/eliminar, botón Exportar ventas

### Turnos
- **Turnos**: iniciar/cerrar turno, tabla de turnos abiertos
- **Historial de turnos**: turnos cerrados con columna Turno (formatoTurno)

### Configuración
- **Perfil**: datos empresa, API key
- **Usuarios y permisos**: tabla usuarios con rol, estado, acciones
- **Historial de subscripciones**: Plan, Fecha alta, Fecha baja, Meses con nosotros, Pagos, Comentarios
- **Subscripciones**: plan actual

### Maestros
- **Categorías**: CRUD con estilo maestro-encabezado
- **Productos**: ProductosLayout, ProductosList, ProductoForm (rutas `/nuevo`, `/editar/:id`)
- **Proveedores**: ProveedoresLayout, ProveedoresList, ProveedorForm
- Clientes fidelizados, Impuestos, Métodos de pago

---

## Utilidades

- **fechaUtils.js**: `diaDeLaSemana(fechaStr)`, `formatoTurno(fechaStr, fechaFinStr)` (día o intervalo)
- **csvMaestros.js**: descargarPlantilla, parsearCSV para carga masiva

---

## Componentes reutilizables

- `PageModule`: título, descripción y contenedor
- `TableResponsive`: tabla responsiva con `data-label` para móvil
- Estilos: `PageModule.css`, `TableResponsive.css`, `FormularioProductos.css`
- Clases: `.maestro-encabezado`, `.maestro-filtro-tag`, `.badge`, `.btn-primary`, etc.

---

## Tecnologías
- React 18
- React Router DOM
- Vite
- Lucide React (iconos)
- CSS puro (sin Tailwind ni librerías UI)

---

## Ejecutar el proyecto
```bash
npm install
npm run dev
```

---

## Repositorio
- GitHub: https://github.com/jackbox77/sistema-pos.git
