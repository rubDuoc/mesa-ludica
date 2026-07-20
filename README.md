# Mesa Lúdica 🎲 — versión Angular
**Asignatura:** Desarrollo Full Stack II (DSY2202) — Evaluación Final Transversal (Semana 9)
**Proyecto:** *Mesa Lúdica*, tienda de juegos de mesa construida de forma incremental a lo largo
de las Experiencias 1, 2 y 3 (Semanas 1 a 8): FrontEnd HTML/CSS/Bootstrap migrado a **Angular**,
formularios reactivos con validaciones, **pruebas unitarias** (Jasmine + Karma), consumo de una
**API REST** (GET/POST/PUT/DELETE) sobre Firebase, **documentación** con Compodoc, contenerización
con **Docker** y **despliegue en la nube**.

## Resumen de la entrega
| # | Criterio | Dónde está |
|---|----------|------------|
| 1 | Git / trabajo colaborativo + **despliegue en Cloud** | Repositorio + Trello + **Render** (imagen Docker: `Dockerfile` + `nginx.conf`) |
| 2 | **Consumo de una API REST** con **GET/POST/PUT/DELETE** sobre JSON | **Firebase Realtime Database** vía `ApiService` y los servicios de dominio |
| 3 | **Despliegue del contenedor** en la nube | Imagen Docker (multi-stage → Nginx) ejecutada en **Render** con URL pública |
| 4 | **Pruebas unitarias** (Jasmine + Karma) | 55 specs sobre servicios, componentes, guards y formularios (`ng test`) |
| 5 | **Documentación** del FrontEnd | Generada con **Compodoc** (`npm run compodoc`) |

**Cuentas de prueba:** admin → `admin@mesaludica.cl` / `Admin123!` · cliente → `cliente@correo.cl` / `Cliente123!`

## Backend: Firebase Realtime Database (API REST)
Todo el contenido de dominio se **consume y se manipula** desde **Firebase Realtime Database**
por REST (cada nodo se accede con el sufijo `.json`):

- **URL centralizada:** `services/firebase.config.ts` (`FIREBASE_DB_URL`). Cambiar de backend
  (JSON local, otra URL o una API real) es cambiar solo esa constante.
- **Cliente REST genérico:** `services/api.service.ts` expone `get/post/put/patch/delete`.
  Los servicios de dominio lo reutilizan.
- **Nodos y operaciones:**

  | Nodo | Servicio | Operaciones REST |
  |------|----------|------------------|
  | `productos` | `ProductoService` | GET (catálogo) · PUT (crear/editar del mantenedor) · DELETE |
  | `categorias` / `banners` | `ProductoService` | GET (portada y banners de categoría) |
  | `usuarios` | `AuthService` | GET (login) · PUT (registro y edición de perfil) |
  | `compras` | `ComprasService` | GET (historial) · PUT (registrar compra) |

- **`localStorage`** queda solo para el estado **transitorio**: la **sesión activa** y el
  **carrito** (helper SSR-safe en `services/storage.util.ts`). Al pagar, el carrito se
  convierte en una **compra**, que sí se persiste en Firebase.
- **Reglas de seguridad:** la base está en modo abierto (`.read`/`.write: true`) de forma
  **consciente**, porque la app maneja su propia autenticación (no usa Firebase Auth). Es
  suficiente para el contexto académico; en producción se cerrarían con tokens.
- **Semillas (subir el JSON a Firebase):** en la raíz del proyecto hay archivos para poblar la
  base con `Import JSON` (consola) o con un PUT REST:
  `firebase-seed.json` (todo), `firebase-seed-usuarios.json`, `firebase-seed-categorias.json`,
  `firebase-seed-banners.json`.

## Contenerización y despliegue (Docker + Cloud)
La app se empaqueta en una imagen Docker y se despliega en la nube en **Render**:

- **`Dockerfile`** (multi-stage): **Node 22** compila Angular (`npm ci` + `ng build`) y **Nginx**
  sirve los estáticos generados en `dist/mesa-ludica/browser/`.
- **`nginx.conf`**: incluye el *fallback* de SPA (`try_files $uri /index.html`) para que al
  recargar en rutas internas (`/categoria/...`, `/mis-compras`, etc.) **no dé 404**. Escucha en
  `${PORT}`, el puerto que el proveedor cloud inyecta en tiempo de ejecución.
- **`.dockerignore`**: deja fuera `node_modules`, `dist`, `.git`, etc. para una imagen liviana.

```bash
# Construir y probar el contenedor localmente (con Docker Desktop abierto)
docker build -t mesaludica .
docker run -p 80:80 mesaludica     # luego abrir http://localhost
```

En **Render**: se crea un *Web Service* apuntando al repositorio con entorno **Docker**; Render
construye la imagen a partir del `Dockerfile`, inyecta la variable `PORT` (consumida por
`nginx.conf`) y publica una **URL pública permanente**. (La app desplegada sigue leyendo/escribiendo
en el mismo Firebase, por ser cliente-servidor.)

> Nota: originalmente se contempló *Play with Docker*, pero ese servicio fue descontinuado y sus
> sesiones expiraban a las 4 horas; **Render** ejecuta la misma imagen Docker y entrega una URL
> pública estable.

## Requisitos
- Node.js 20.19+ / 22.12+ / 24+
- Angular CLI 20 (se usa vía `npx`)
- Docker Desktop (para construir/ejecutar la imagen)

## Cómo ejecutar (desarrollo)
```bash
npm install         # instala dependencias (incluye Bootstrap y Compodoc)
npx ng serve        # levanta el servidor en http://localhost:4200/
npx ng test         # corre las pruebas unitarias (Jasmine + Karma)
npm run compodoc:serve   # genera y sirve la documentación en http://localhost:8080/
```

## Documentación (Compodoc)
El código está documentado con comentarios **JSDoc** (`@description`, `@param`, `@returns`,
`@usageNotes`). Se genera con **Compodoc** (`npm run compodoc` / `npm run compodoc:serve`),
usando `tsconfig.doc.json` (incluye `src`, excluye los `.spec.ts`).

## Estructura
```
Dockerfile / nginx.conf / .dockerignore  → contenerización (build Angular + Nginx SPA)
firebase-seed*.json                       → semillas para poblar Firebase (Import JSON / PUT)
src/app/
├── components/
│   ├── header/ footer/     → navbar adaptable al rol + pie de página
│   ├── inicio/ categoria/ detalle/ → catálogo (consume productos/categorías/banners de Firebase)
│   ├── catalogo-api/       → tabla que se suscribe al Observable del servicio (demo de consumo)
│   ├── registro/ login/ recuperar/ perfil/ → cuentas (forms reactivos, async contra Firebase)
│   ├── carrito/ pago/ mis-compras/ → carrito (localStorage), pago simulado e historial (Firebase)
│   └── admin/              → panel + mantenedor de productos (CRUD real contra Firebase)
├── services/
│   ├── firebase.config.ts  → URL base de la Realtime Database (centralizada)
│   ├── api.service.ts       → cliente REST genérico (GET/POST/PUT/PATCH/DELETE)
│   ├── producto.service.ts  → catálogo, categorías y banners desde Firebase + CRUD (signal)
│   ├── carrito.service.ts   → estado del carrito (signals) + control de stock + localStorage
│   ├── auth.service.ts      → login/registro/perfil async contra Firebase; sesión en localStorage
│   ├── compras.service.ts   → historial de compras contra Firebase
│   └── storage.util.ts      → helpers leer/guardar en localStorage (SSR-safe)
├── guards/
│   └── auth.guard.ts        → authGuard (sesión) y adminGuard (rol admin)
├── validators/
│   └── registro.validators.ts → validadores personalizados (fuerza, edad, contraseñas)
├── data/
│   ├── productos.ts → respaldo estático (fallback offline de catálogo/categorías/banners)
│   └── usuarios.ts  → cuentas demo de referencia para la semilla
├── models/
│   ├── producto.ts  → interfaces Producto / Categoria
│   └── usuario.ts   → tipo Rol e interfaz Usuario (con id de Firebase)
├── app.config.ts   → provideHttpClient + provideAppInitializer (precarga desde Firebase)
├── app.html         → <app-header> + <router-outlet> + <app-footer>
└── app.routes.ts    → rutas de la aplicación (con guards)
```

## Conceptos aplicados
### Experiencia 3 — Semana 8 (API REST + Docker + Cloud)
- **Consumo y manipulación de API REST:** `ApiService` genérico sobre `HttpClient` con
  **GET/POST/PUT/DELETE**; los servicios de dominio (productos, usuarios, compras) lo usan.
- **`Observable` / `Promise` / signals:** las operaciones devuelven `Observable`; el arranque
  precarga los datos con `firstValueFrom`/`forkJoin`; las vistas reaccionan vía signals.
- **Estados de carga y error:** spinners, mensajes y botones deshabilitados (`Guardando…`,
  `Procesando…`) en mantenedor, login/registro/perfil, pago y mis-compras.
- **Contenerización con Docker:** imagen multi-stage (Node build → Nginx) con `nginx.conf`
  para el enrutado de la SPA.
- **Despliegue en Cloud:** ejecución del contenedor en Render con URL pública permanente.

### Experiencia 2 y 3 — Semanas 4 a 7 (base)
- **Migración HTML/CSS/Bootstrap a Angular**, componentes reutilizables (header/footer) y
  directivas `*ngFor` / `*ngIf` (grillas, descuentos, estados vacíos, stock, contador de carrito).
- **Formularios reactivos (S5):** registro con `FormGroup`, `FormBuilder` y `Validators`
  (obligatorios excepto dirección, formato email, contraseñas iguales, contraseña con número +
  mayúscula + carácter especial y largo 6–18, edad mínima 13).
- **Roles, sesión y guards (S6):** roles cliente/admin; el header se adapta y los *guards*
  protegen `/perfil`, `/pago`, `/mis-compras` y `/admin`.
- **Carrito, pago simulado y mantenedor (S6):** carrito con control de stock, pago sin cobro
  real y panel de administración.
- **Consumo de JSON (S7):** base de `HttpClient` + `Observable` que en la S8 evolucionó a la
  API REST completa sobre Firebase.

## Pruebas unitarias (Jasmine + Karma)
Se corren con `ng test`. Cubren servicios, componentes, guards, formularios, consumo REST y el
flujo de compra, usando `HttpTestingController` para simular Firebase:
- `producto.service.spec.ts` — GET de catálogo/categorías/banners y **CRUD (PUT/DELETE)** del mantenedor.
- `catalogo-api.spec.ts` — el componente **se suscribe** al Observable y arma la tabla; maneja el error.
- `auth.service.spec.ts` — login (GET), registro (PUT), correo duplicado y sesión desde `localStorage`.
- `compras.service.spec.ts` — registrar (GET+PUT), ids correlativos y carga del historial.
- `carrito.service.spec.ts` — agregar, cantidades, total, vaciar y **control de stock**.
- `auth.guard.spec.ts` — `authGuard` y `adminGuard` (bloqueo/redirección y acceso por rol).
- `pago.spec.ts` — registra la compra en Firebase y vacía el carrito (flujo de pago).
- `mis-compras.spec.ts` — carga el historial desde Firebase y filtra por usuario.
- `registro.spec.ts` / `login.spec.ts` / `perfil.spec.ts` — formularios reactivos + flujo async.
- `app.spec.ts` — render del componente raíz.

## Rutas
| Ruta                    | Componente  | Descripción                          |
|-------------------------|-------------|--------------------------------------|
| `/inicio`               | Inicio      | Portada con categorías (desde Firebase) |
| `/categoria/:nombre`    | CategoriaPage | Catálogo filtrado por categoría    |
| `/detalle/:id`          | Detalle     | Ficha de un producto                 |
| `/catalogo-api`         | CatalogoApi | Tabla que consume el catálogo vía Observable (no está en el menú) |
| `/registro`             | Registro    | Formulario reactivo con validaciones |
| `/login`                | Login       | Inicio de sesión                     |
| `/recuperar`            | Recuperar   | Recuperar contraseña                 |
| `/carrito`              | Carrito     | Carrito de compra                    |
| `/perfil`               | Perfil      | Modificación de perfil (requiere sesión) |
| `/pago`                 | Pago        | Pago simulado (requiere sesión)      |
| `/mis-compras`          | MisCompras  | Historial de compras (requiere sesión) |
| `/admin`                | Admin       | Panel + mantenedor de productos (solo admin) |
