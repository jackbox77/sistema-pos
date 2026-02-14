# Resumen del Proyecto - Sistema POS

> **Para nuevo chat:** Copia este resumen al iniciar una conversación para que el asistente tenga contexto del proyecto.

## Descripción general
Sistema de punto de venta (POS) inspirado en Alegra, desarrollado con **React + Vite + React Router**. No incluye módulo de inventario por decisión del usuario.

---

## Estructura del menú lateral (Sidebar)

| Módulo | Submódulos |
|--------|------------|
| **Inicio** | — |
| **POS** | Ingresos (Historial ventas, Comprobante venta diarias), Turnos inicio y fin, Facturar |
| **Habilitar factura electrónica** | — |
| **Ingresos** | Factura de ventas, Pagos recibidos, Devoluciones, Remisiones |
| **Gastos** | Facturas de compras, Documento soporte, Pagos, Órdenes de compra |
| **Contabilidad** (opcional) | Libro diario, Activos, Catálogo de cuentas |
| **Nómina** | Roles y usuarios |
| **Configuración** | Información de la empresa, Subscripciones |
| **Maestros** | Categorías, Productos, Proveedores, Clientes fidelizados, Impuestos |

---

## Layout y diseño

- **Sidebar estilo Alegra:** Colapsado por defecto (64px, solo iconos). Se expande (260px) con clic en el botón de tres líneas. No hay expansión por hover.
- **Sin hamburger en appbar:** El botón toggle está en el sidebar, no en el header.
- **Responsive:** Móvil, tablet y desktop. Tablas con scroll horizontal y cards en móvil. Formularios con targets táctiles.
- **Header:** Logo "Sistema POS" a la izquierda. En móvil tiene `padding-left: 72px` para no quedar tapado por el sidebar.

---

## Funcionalidades implementadas

### Maestros - Categorías
- Popups para crear, editar y eliminar (ModalFormCategoria, ModalConfirmarEliminar).
- Estado local con array de categorías.

### Maestros - Productos
- **Vista lista:** `ProductosList.jsx` con tabla, botón "+ Nuevo producto", enlaces a editar.
- **Vista formulario:** `ProductoForm.jsx` para crear y editar en rutas separadas.
- **Popup eliminar:** Modal de confirmación.
- **Rutas:** `/maestros/productos`, `/maestros/productos/nuevo`, `/maestros/productos/editar/:id`.
- **Context:** `ProductosLayout.jsx` maneja estado con `ProductosContext`.

### Maestros - Proveedores
- Popups para crear, editar y eliminar (ModalFormProveedor, ModalConfirmarEliminar).
- Estado local con array de proveedores (NIT, Nombre, Contacto, Teléfono, Compras asociadas).
- Búsqueda por nombre, NIT o contacto. Mensaje cuando no hay resultados.

### POS - Facturar
- Formulario básico de productos (Producto/Servicio/Combo) en modal.
- Campos: Nombre, Categoría, Unidad, Bodega, Cantidad, Costo, Precio base, Impuestos, Precio final.

### Ingresos, Gastos, etc.
- Páginas con tablas, datos de ejemplo, filtros y acciones (estructura base, sin lógica de negocio).

---

## Componentes reutilizables

- `PageModule`: título, descripción y contenedor de contenido.
- `TableResponsive`: tabla con scroll horizontal y cards en móvil (usa `data-label` en `td`).
- `FormularioProductos`: modal para crear producto/servicio/combo.
- Estilos compartidos en `PageModule.css`, `FormularioProductos.css`.

---

## Tecnologías
- React 18
- React Router DOM
- Vite
- CSS puro (sin Tailwind ni librerías UI)

---

## Ejecutar el proyecto
```bash
npm install
npm run dev
```

---

## Notas para continuar
- Las tablas de Ingresos, Gastos, Contabilidad, etc. tienen datos de ejemplo y estructura preparada.
- No hay backend ni persistencia real; todo es estado local/context.
- El espacio del logo en el header está reservado para una imagen futura.
- Productos.jsx existe pero ya no se usa; la lógica está en ProductosLayout, ProductosList y ProductoForm.
