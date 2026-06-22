# Mesa Lúdica 🎲 — versión Angular

Migración a **Angular** del FrontEnd de la PYME "Mesa Lúdica" (tienda de juegos de mesa),
creado originalmente en HTML/CSS/Bootstrap en la Experiencia 1.

**Asignatura:** Desarrollo Full Stack II (DSY2202) — Experiencia 2, Semanas 4 y 5
**Actividad:** "Integrando un framework" (S4) e "Implementando pruebas unitarias" (S5)

## Requisitos
- Node.js 20.19+ / 22.12+ / 24+
- Angular CLI 20 (`npm install -g @angular/cli@20`, opcional: se usa vía `npx`)

## Cómo ejecutar
```bash
npm install      # instala dependencias (incluye Bootstrap)
npx ng serve     # levanta el servidor en http://localhost:4200/
npx ng test      # corre las pruebas unitarias (Jasmine + Karma)
```

## Estructura
```
src/app/
├── components/
│   ├── header/      → navbar reutilizable + contador del carrito
│   ├── footer/      → pie de página reutilizable
│   ├── inicio/      → portada con las 4 categorías (*ngFor)
│   ├── categoria/   → UNA vista para las 4 categorías (lee el parámetro de ruta)
│   ├── detalle/     → detalle de un producto (recibe el id por la URL) + agregar al carrito
│   └── registro/    → formulario reactivo con validaciones y vista previa en vivo
├── services/
│   ├── producto.service.ts → acceso al catálogo (preparado para API REST en Exp3)
│   └── carrito.service.ts  → estado del carrito con signals
├── validators/
│   └── registro.validators.ts → validadores personalizados (fuerza, edad, contraseñas)
├── data/
│   └── productos.ts → datos estáticos (12 juegos + categorías) en variables
├── models/
│   └── producto.ts  → interfaces TypeScript
├── app.html         → <app-header> + <router-outlet> + <app-footer>
└── app.routes.ts    → rutas de la aplicación
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
  - Contraseña con **al menos un número y una mayúscula**, y largo **entre 6 y 18**.
  - **Edad mínima de 13 años** (validador personalizado sobre la fecha exacta).
  - Botones **Registrarme** y **Limpiar formulario**.
- **Pruebas unitarias (S5):** Jasmine + Karma. `registro.spec.ts` valida el formulario
  (vacío inválido, contraseñas distintas, menor de 13, contraseña débil, caso válido)
  y `app.spec.ts` verifica el render del componente raíz. Se corren con `ng test`.
- **Paso de datos entre páginas:** la categoría envía el `id` del producto a `detalle/:id`,
  que muestra cualquiera de los 12 juegos con un único HTML dinámico.
- **Carrito de compra:** desde el detalle se agregan productos al carrito, reflejado en el header.

## Rutas
| Ruta                    | Componente | Descripción                          |
|-------------------------|------------|--------------------------------------|
| `/inicio`               | Inicio     | Portada con categorías               |
| `/categoria/:nombre`    | Categoria  | Catálogo filtrado por categoría      |
| `/detalle/:id`          | Detalle    | Ficha de un producto                 |
| `/registro`             | Registro   | Formulario reactivo con validaciones |
