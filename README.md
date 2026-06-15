# Mesa Lúdica 🎲 — versión Angular

Migración a **Angular** del FrontEnd de la PYME "Mesa Lúdica" (tienda de juegos de mesa),
creado originalmente en HTML/CSS/Bootstrap en la Experiencia 1.

**Asignatura:** Desarrollo Full Stack II (DSY2202) — Experiencia 2, Semana 4
**Actividad:** "Integrando un framework a nuestro FrontEnd"

## Requisitos
- Node.js 20.19+ / 22.12+ / 24+
- Angular CLI 20 (`npm install -g @angular/cli@20`, opcional: se usa vía `npx`)

## Cómo ejecutar
```bash
npm install      # instala dependencias (incluye Bootstrap)
npx ng serve     # levanta el servidor en http://localhost:4200/
```

## Estructura
```
src/app/
├── components/
│   ├── inicio/      → portada con las 4 categorías (*ngFor)
│   ├── categoria/   → UNA vista para las 4 categorías (lee el parámetro de ruta)
│   ├── detalle/     → detalle de un producto (recibe el id por la URL)
│   └── registro/    → formulario con [(ngModel)] y vista previa en vivo
├── data/
│   └── productos.ts → datos estáticos (12 juegos + categorías) en variables
├── models/
│   └── producto.ts  → interfaces TypeScript
├── app.html         → navbar + <router-outlet> + footer
└── app.routes.ts    → rutas de la aplicación
```

## Conceptos aplicados (pauta de evaluación)
- **Migración HTML/CSS/Bootstrap a Angular:** diseño portado a `styles.scss` global;
  Bootstrap instalado por npm y registrado en `angular.json` (sin CDN).
- **Datos estáticos en variables:** `src/app/data/productos.ts`.
- **Directiva `*ngFor`:** grilla de categorías (inicio) y de productos (categoría).
- **Directiva `*ngIf`:** etiqueta de descuento, estado vacío, stock y vista previa del formulario.
- **Directiva `[(ngModel)]`:** formulario de registro (sin validaciones, según la consigna).
- **Paso de datos entre páginas:** la categoría envía el `id` del producto a `detalle/:id`,
  que muestra cualquiera de los 12 juegos con un único HTML dinámico.

## Rutas
| Ruta                    | Componente | Descripción                          |
|-------------------------|------------|--------------------------------------|
| `/inicio`               | Inicio     | Portada con categorías               |
| `/categoria/:nombre`    | Categoria  | Catálogo filtrado por categoría      |
| `/detalle/:id`          | Detalle    | Ficha de un producto                 |
| `/registro`             | Registro   | Formulario con ngModel               |
