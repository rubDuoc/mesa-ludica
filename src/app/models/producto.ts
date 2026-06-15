/* ============================================================
   Mesa Lúdica - Modelo de datos
   DSY2202 - Experiencia 2, Semana 4
   Tipado estático de TypeScript para los productos y categorías.
   ============================================================ */

export interface Producto {
  id: string;
  nombre: string;
  categoria: 'estrategia' | 'familiares' | 'fiesta' | 'cartas';
  precio: number;
  precio_antiguo: number | null;
  stock: number;
  imagen: string;
  descripcion: string;
}

export interface Categoria {
  slug: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}
