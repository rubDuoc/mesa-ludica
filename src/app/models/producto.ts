/* ============================================================
   Mesa Lúdica - Modelo de datos
   DSY2202 - Experiencia 2, Semana 4
   Tipado estático de TypeScript para los productos y categorías.
   ============================================================ */

/**
 * @description
 * Representa un juego de mesa del catálogo de Mesa Lúdica.
 */
export interface Producto {
  /** Identificador único del producto (ej: 'p-001'). */
  id: string;
  /** Nombre comercial del juego. */
  nombre: string;
  /** Categoría a la que pertenece el juego. */
  categoria: 'estrategia' | 'familiares' | 'fiesta' | 'cartas';
  /** Precio actual en pesos chilenos. */
  precio: number;
  /** Precio anterior cuando el producto está en oferta; null si no aplica. */
  precio_antiguo: number | null;
  /** Unidades disponibles en inventario. */
  stock: number;
  /** Ruta de la imagen del producto. */
  imagen: string;
  /** Descripción breve del juego. */
  descripcion: string;
}

/**
 * @description
 * Representa una categoría del catálogo que agrupa varios productos.
 */
export interface Categoria {
  /** Identificador en la URL (ej: 'estrategia'). */
  slug: string;
  /** Nombre visible de la categoría. */
  nombre: string;
  /** Descripción corta de la categoría. */
  descripcion: string;
  /** Ruta de la imagen representativa. */
  imagen: string;
}
