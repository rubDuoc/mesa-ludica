# Mesa Lúdica 🎲 — versión Angular
**Asignatura:** Desarrollo Full Stack II (DSY2202) — Experiencia 2 (Semanas 4 a 6)
**Actividad:** Evaluación sumativa Exp. 2 — FrontEnd en Angular con pruebas unitarias y documentación.

## Resumen de la entrega (pauta S6)
| # | Criterio | Dónde está |
|---|----------|------------|
| 1 | Git / trabajo colaborativo | Repositorio + Trello |
| 2 | App Angular (HTML/CSS/Bootstrap) | Toda la app, grid de 12 columnas responsive |
| 3 | Datos estáticos + `*ngIf`/`*ngFor`/`ngModel` + paso de datos | catálogo, detalle, formularios |
| 4 | Documentación (Compodoc) | JSDoc en todo el código → `npm run compodoc:serve` |
| 5 | Formularios reactivos con validaciones | registro, login, recuperar, perfil, mantenedor |
| 6 | Pruebas unitarias (Jasmine + Karma) | ~31 pruebas → `ng test` |
| 7 | Video de presentación | Kaltura |

**Cuentas de prueba:** admin → `admin@mesaludica.cl` / `Admin123!` · cliente → `cliente@correo.cl` / `Cliente123!`

## Requisitos
- Node.js 20.19+ / 22.12+ / 24+
- Angular CLI 20 (`npm install -g @angular/cli@20`, opcional: se usa vía `npx`)

## Cómo ejecutar
```bash
npm install         # instala dependencias (incluye Bootstrap y Compodoc)
npx ng serve        # levanta el servidor en http://localhost:4200/
npx ng test         # corre las pruebas unitarias (Jasmine + Karma)
npm run compodoc:serve   # genera y sirve la documentación en http://localhost:8080/
```

## Documentación (Compodoc)
El código está documentado con comentarios **JSDoc** (`@description`, `@param`,
`@returns`, `@usageNotes`). La documentación se genera con **Compodoc**:
```bash
npm run compodoc        # genera la doc en la carpeta /documentation
npm run compodoc:serve  # la genera y la abre en el navegador (localhost:8080)
```
Usa `tsconfig.doc.json`, que incluye `src` y excluye los archivos `.spec.ts`.

## Estructura
```
src/app/
├── components/
│   ├── header/ footer/     → navbar adaptable al rol + pie de página
│   ├── inicio/ categoria/ detalle/ → catálogo (datos estáticos + directivas)
│   ├── registro/ login/ recuperar/ perfil/ → pantallas de cuenta (forms reactivos)
│   ├── carrito/ pago/ mis-compras/ → carrito, pago simulado e historial
│   └── admin/              → panel + mantenedor de productos (solo admin)
├── services/
│   ├── producto.service.ts → catálogo en signal + CRUD del mantenedor
│   ├── carrito.service.ts  → estado del carrito (signals: totalItems, total)
│   ├── auth.service.ts     → sesión simulada y roles (signals)
│   └── compras.service.ts  → historial de compras
├── guards/
│   └── auth.guard.ts       → authGuard (sesión) y adminGuard (rol admin)
├── validators/
│   └── registro.validators.ts → validadores personalizados (fuerza, edad, contraseñas)
├── data/
│   ├── productos.ts → datos estáticos (12 juegos + categorías) en variables
│   └── usuarios.ts  → cuentas demo (admin y cliente)
├── models/
│   ├── producto.ts  → interfaces Producto / Categoria
│   └── usuario.ts   → tipo Rol e interfaz Usuario
├── app.html         → <app-header> + <router-outlet> + <app-footer>
└── app.routes.ts    → rutas de la aplicación (con guards)
```

## Conceptos aplicados (pauta de evaluación)
- **Migración HTML/CSS/Bootstrap a Angular:** diseño portado a `styles.scss` global;
  Bootstrap instalado por npm y registrado en `angular.json` (sin CDN).
- **Componentes reutilizables:** header y footer separados en sus propios componentes.
- **Servicios e inyección de dependencias:** `ProductoService` centraliza el catálogo
  (listo para reemplazarse por una API REST en la Experiencia 3) y `CarritoService`
  maneja el estado del carrito con *signals*.
- **Datos estáticos en variables:** `src/app/data/productos.ts`.
- **Directiva `*ngFor`:** grilla de categorías (inicio) y de productos (categoría).
- **Directiva `*ngIf`:** etiqueta de descuento, estado vacío, stock, contador del carrito,
  mensajes de validación y vista previa del formulario.
- **Formularios reactivos (S5):** registro con `FormGroup`, `FormBuilder` y `Validators`.
  Validaciones solicitadas:
  - Todos los campos obligatorios **excepto la dirección de despacho** (opcional).
  - Correo con formato email.
  - **Las dos contraseñas deben coincidir** (validador a nivel de `FormGroup`).
  - Contraseña con **número, mayúscula y carácter especial**, y largo **entre 6 y 18**
    (4+ validaciones de seguridad).
  - **Edad mínima de 13 años** (validador personalizado sobre la fecha exacta).
  - Botones **Registrarme** y **Limpiar formulario**.
- **Pantallas de cuenta (S6):** `login` (inicio de sesión), `recuperar` (recuperar
  contraseña) y `perfil` (modificación de perfil), todas con formularios reactivos y
  validaciones. El menú las enlaza desde el header.
- **Roles y sesión (S6):** `AuthService` (signals) maneja la sesión simulada con dos
  roles de distinto privilegio: **cliente** y **admin**. El menú del header se adapta
  a la sesión y los *guards* (`authGuard`, `adminGuard`) protegen `/perfil` y `/admin`.
  Cuentas de prueba: `admin@mesaludica.cl / Admin123!` y `cliente@correo.cl / Cliente123!`.
  Al **registrarse** se crea una cuenta de **cliente** y la sesión queda iniciada al instante
  (los usuarios viven en memoria; se reinician al recargar, hasta integrar la API en Exp3).
- **Pruebas unitarias (Jasmine + Karma):** se corren con `ng test`. Cubren:
  - `registro.spec.ts` — validaciones del formulario de registro.
  - `login.spec.ts` / `perfil.spec.ts` — login (credenciales) y perfil (precarga, teléfono).
  - `auth.service.spec.ts` — login/logout y roles.
  - `carrito.service.spec.ts` — agregar, cantidades, total y vaciar.
  - `producto.service.spec.ts` — CRUD del catálogo, descuento y formato de precio.
  - `app.spec.ts` — render del componente raíz.
- **Paso de datos entre páginas:** la categoría envía el `id` del producto a `detalle/:id`,
  que muestra cualquiera de los 12 juegos con un único HTML dinámico.
- **Carrito y compra (S6):** `CarritoService` (signals) maneja el carrito; página
  `/carrito` para cambiar cantidades y quitar, **pago simulado** en `/pago` (sin pasarela
  real) que registra la compra en `ComprasService`, e historial en `/mis-compras`.
- **Mantenedor de productos (S6):** el panel `/admin` (solo admin) permite **registrar,
  editar y eliminar** productos y ver el inventario; el catálogo vive en un signal dentro
  de `ProductoService`.

## Rutas
| Ruta                    | Componente | Descripción                          |
|-------------------------|------------|--------------------------------------|
| `/inicio`               | Inicio     | Portada con categorías               |
| `/categoria/:nombre`    | Categoria  | Catálogo filtrado por categoría      |
| `/detalle/:id`          | Detalle    | Ficha de un producto                 |
| `/registro`             | Registro   | Formulario reactivo con validaciones |
| `/login`                | Login      | Inicio de sesión                     |
| `/recuperar`            | Recuperar  | Recuperar contraseña                 |
| `/carrito`              | Carrito    | Carrito de compra                    |
| `/perfil`               | Perfil     | Modificación de perfil (requiere sesión) |
| `/pago`                 | Pago       | Pago simulado (requiere sesión)      |
| `/mis-compras`          | MisCompras | Historial de compras (requiere sesión) |
| `/admin`                | Admin      | Panel + mantenedor de productos (solo admin) |
