/* ============================================================
   Mesa Lúdica - Servicio de productos
   DSY2202 - Experiencia 2

   Centraliza el acceso a los datos del catálogo. Hoy devuelve los
   datos estáticos de data/productos.ts, pero al estar aislado en un
   servicio, en la Experiencia 3 bastará con cambiar el cuerpo de
   estos métodos por llamadas HttpClient a una API REST, sin tocar
   los componentes.
   ============================================================ */

import { Injectable } from '@angular/core';
import { CATEGORIAS, BANNERS, PRODUCTOS } from '../data/productos';
import { Producto, Categoria } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  /* Todas las categorías (portada). */
  getCategorias(): Categoria[] {
    return CATEGORIAS;
  }

  /* Texto del banner de una categoría; trae un valor por defecto si no existe. */
  getBanner(slug: string): { titulo: string; bajada: string } {
    return BANNERS[slug] ?? { titulo: 'Categoría', bajada: '' };
  }

  /* Productos que pertenecen a una categoría. */
  getProductosPorCategoria(slug: string): Producto[] {
    return PRODUCTOS.filter(p => p.categoria === slug);
  }

  /* Un producto por su id (o undefined si no existe). */
  getProductoPorId(id: string | null): Producto | undefined {
    return PRODUCTOS.find(p => p.id === id);
  }

  /* Calcula el porcentaje de descuento de un producto en oferta (0 si no hay). */
  descuento(p: Producto): number {
    if (!p.precio_antiguo || p.precio_antiguo <= p.precio) {
      return 0;
    }
    return Math.round((1 - p.precio / p.precio_antiguo) * 100);
  }

  /* Formatea un precio al estilo chileno: $31.990 */
  formatearPrecio(n: number): string {
    return '$' + Number(n).toLocaleString('es-CL');
  }
}
