# Mesa Lúdica 🎲 — versión Angular
**Asignatura:** Desarrollo Full Stack II (DSY2202) — Experiencia 3 (Semana 7)
**Actividad:** Actividad Formativa 5 — *Integrando APIs externas a nuestro FrontEnd* (consumo de JSON).
Continúa el proyecto de la Experiencia 2 (Semanas 4 a 6).

## Resumen de la entrega (pauta S7)
| # | Criterio | Dónde está |
|---|----------|------------|
| 1 | Git / trabajo colaborativo | Repositorio + Trello |
| 2 | Archivo **JSON** en formato correcto | `public/data/productos.json` (array JSON con los 12 productos) |
| 3 | **Servicio** que consume datos desde el JSON | `ProductoService` con `HttpClient`: `cargarCatalogo()` y `getProductos()` |

**Componente nuevo que muestra los datos del JSON:** `/catalogo-api` (se suscribe al `Observable` y arma una tabla con `*ngIf/else #noData`).

**Cuentas de prueba:** admin → `admin@mesaludica.cl` / `Admin123!` · cliente → `cliente@correo.cl` / `Cliente123!`

## Consumo de JSON (Experiencia 3)
El catálogo dejó de ser un arreglo estático y ahora se **consume desde un archivo JSON**
mediante `HttpClient`:

- **Archivo JSON:** `public/data/productos.json` (se sirve en `/data/productos.json`).
- **Servicio:** `ProductoService` inyecta `HttpClient` y expone:
  - `getProductos(): Observable<Producto[]>` → GET directo al JSON (al que se suscribe el
    componente `catalogo-api`).
  - `cargarCatalogo(): Promise<void>` → siembra el catálogo en el arranque
    (`provideAppInitializer` en `app.config.ts`) para que las páginas tengan los datos desde
    el primer render. Si falla, cae en los datos estáticos como respaldo.
- **Persistencia (`localStorage`):** estrategia **JSON = semilla / `localStorage` = cambios**.
  El catálogo del mantenedor, los usuarios registrados, la sesión activa, el carrito y el
  historial de compras se guardan en `localStorage` (helper SSR-safe en
  `services/storage.util.ts`), así **no se pierden al recargar**.

> La página **Catálogo API** siempre hace un GET fresco al JSON (visible en la pestaña
> *Network*), mientras que el resto de la app refleja los cambios guardados en `localStorage`.

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
public/
└── data/productos.json  → catálogo consumido por HttpClient (archivo JSON)
src/app/
├── components/
│   ├── header/ footer/     → navbar adaptable al rol + pie de página
│   ├── inicio/ categoria/ detalle/ → catálogo (consume el JSON vía el servicio)
│   ├── catalogo-api/       → tabla que se suscribe al JSON (Observable + *ngIf/else)
│   ├── registro/ login/ recuperar/ perfil/ → pantallas de cuenta (forms reactivos)
│   ├── carrito/ pago/ mis-compras/ → carrito, pago simulado e historial
│   └── admin/              → panel + mantenedor de productos (solo admin)
├── services/
│   ├── producto.service.ts → consume el JSON (HttpClient) + CRUD del mantenedor (signal)
│   ├── carrito.service.ts  → estado del carrito (signals) + control de stock + localStorage
│   ├── auth.service.ts     → sesión y roles (signals) persistidos en localStorage
│   ├── compras.service.ts  → historial de compras persistido en localStorage
│   └── storage.util.ts     → helpers leer/guardar en localStorage (SSR-safe)
├── guards/
│   └── auth.guard.ts       → authGuard (sesión) y adminGuard (rol admin)
├── validators/
│   └── registro.validators.ts → validadores personalizados (fuerza, edad, contraseñas)
├── data/
│   ├── productos.ts → categorías, banners y respaldo estático del catálogo
│   └── usuarios.ts  → cuentas demo (admin y cliente)
├── models/
│   ├── producto.ts  → interfaces Producto / Categoria
│   └── usuario.ts   → tipo Rol e interfaz Usuario
├── app.config.ts   → provideHttpClient + provideAppInitializer (siembra el catálogo)
├── app.html         → <app-header> + <router-outlet> + <app-footer>
└── app.routes.ts    → rutas de la aplicación (con guards)
```

## Conceptos aplicados
### Experiencia 3 — Semana 7 (consumo de JSON)
- **Archivo JSON:** `public/data/productos.json` en formato correcto (array de objetos).
- **`HttpClient` + `Observable`:** `ProductoService` consume el JSON; `catalogo-api` se
  **suscribe** en `ngOnInit` y muestra los datos en una tabla Bootstrap con `*ngIf/else`
  y la plantilla `#noData` para el estado vacío.
- **`provideHttpClient` + `provideAppInitializer`:** registro de `HttpClient` y precarga del
  catálogo al arrancar.
- **Persistencia con `localStorage`:** usuarios, sesión, carrito, historial y cambios del
  mantenedor persisten entre recargas (helper SSR-safe).
- **Control de stock:** el carrito no permite agregar/incrementar por sobre el stock.

### Experiencia 2 — Semanas 4 a 6 (base)
- **Migración HTML/CSS/Bootstrap a Angular:** diseño portado a `styles.scss` global;
  Bootstrap instalado por npm y registrado en `angular.json` (sin CDN).
- **Componentes reutilizables:** header y footer separados en sus propios componentes.
- **Directivas `*ngFor` / `*ngIf`:** grillas de categorías y productos, descuentos, estados
  vacíos, stock, contador del carrito y mensajes de validación.
- **Formularios reactivos (S5):** registro con `FormGroup`, `FormBuilder` y `Validators`.
  Validaciones: campos obligatorios **excepto dirección**, correo con formato email, **las
  dos contraseñas deben coincidir** (validador de `FormGroup`), contraseña con **número,
  mayúscula y carácter especial** y largo **6–18**, **edad mínima 13 años**, y botones
  **Registrarme** / **Limpiar**.
- **Pantallas de cuenta (S6):** `login`, `recuperar` y `perfil`, con formularios reactivos.
- **Roles y sesión (S6):** `AuthService` (signals) con roles **cliente** y **admin**; el
  header se adapta a la sesión y los *guards* protegen `/perfil`, `/pago`, `/mis-compras` y
  `/admin`. Al **registrarse** se crea una cuenta de cliente con la sesión ya iniciada.
- **Carrito y compra (S6):** `CarritoService` (signals), página `/carrito`, **pago simulado**
  en `/pago` (registra en `ComprasService`) e historial en `/mis-compras`.
- **Mantenedor de productos (S6):** panel `/admin` (solo admin) para registrar, editar y
  eliminar productos.

## Pruebas unitarias (Jasmine + Karma)
Se corren con `ng test`. Cubren servicios, componentes, guards, formularios, consumo de JSON
y flujo de compra:
- `producto.service.spec.ts` — **consumo del JSON con `HttpTestingController`**, `getProductos()`
  como Observable, y CRUD/descuento/formato del catálogo.
- `catalogo-api.spec.ts` — el componente **se suscribe al JSON**, arma la tabla y maneja el error.
- `carrito.service.spec.ts` — agregar, cantidades, total, vaciar y **control de stock**.
- `auth.service.spec.ts` — login/logout, roles, registro y **recuperar sesión de `localStorage`**.
- `compras.service.spec.ts` — registrar, `comprasDe`, ids correlativos y carga desde `localStorage`.
- `auth.guard.spec.ts` — `authGuard` y `adminGuard` (bloqueo/redirección y acceso por rol).
- `pago.spec.ts` — registra la compra y vacía el carrito (flujo de pago).
- `registro.spec.ts` / `login.spec.ts` / `perfil.spec.ts` — formularios reactivos.
- `app.spec.ts` — render del componente raíz.

## Rutas
| Ruta                    | Componente  | Descripción                          |
|-------------------------|-------------|--------------------------------------|
| `/inicio`               | Inicio      | Portada con categorías               |
| `/catalogo-api`         | CatalogoApi | **Catálogo consumido desde el JSON (HttpClient)** |
| `/categoria/:nombre`    | CategoriaPage | Catálogo filtrado por categoría    |
| `/detalle/:id`          | Detalle     | Ficha de un producto                 |
| `/registro`             | Registro    | Formulario reactivo con validaciones |
| `/login`                | Login       | Inicio de sesión                     |
| `/recuperar`            | Recuperar   | Recuperar contraseña                 |
| `/carrito`              | Carrito     | Carrito de compra                    |
| `/perfil`               | Perfil      | Modificación de perfil (requiere sesión) |
| `/pago`                 | Pago        | Pago simulado (requiere sesión)      |
| `/mis-compras`          | MisCompras  | Historial de compras (requiere sesión) |
| `/admin`                | Admin       | Panel + mantenedor de productos (solo admin) |
