/* ============================================================
   Mesa Lúdica - Servicio de productos
   DSY2202 - Experiencia 2

   Centraliza el acceso al catálogo. Mantiene los productos en un signal
   (inicializado con los datos estáticos) para que el mantenedor del admin
   pueda agregarlos, editarlos o eliminarlos. En la Experiencia 3 estos
   métodos pasarán a consumir una API REST con HttpClient.
   ============================================================ */

import { Injectable, signal, computed } from '@angular/core';
import { CATEGORIAS, BANNERS, PRODUCTOS } from '../data/productos';
import { Producto, Categoria } from '../models/producto';

/**
 * @description
 * Servicio que centraliza el acceso al catálogo de productos y categorías.
 * Los productos viven en un signal para poder administrarlos (CRUD) desde el
 * panel de administración. En la Experiencia 3 pasará a consumir una API REST.
 */
@Injectable({ providedIn: 'root' })
export class ProductoService {
  /** Estado del catálogo, inicializado con los datos estáticos. */
  private readonly productos = signal<Producto[]>([...PRODUCTOS]);

  /** Catálogo en modo solo lectura (reactivo) para el mantenedor. */
  readonly catalogo = this.productos.asReadonly();

  /** Cantidad de productos en el catálogo. */
  readonly totalProductos = computed(() => this.productos().length);

  /**
   * Devuelve todas las categorías que se muestran en la portada.
   * @returns Arreglo de categorías del catálogo.
   */
  getCategorias(): Categoria[] {
    return CATEGORIAS;
  }

  /**
   * Obtiene el texto del banner de una categoría.
   * @param slug Identificador de la categoría (ej: 'estrategia').
   * @returns Título y bajada del banner; un valor por defecto si el slug no existe.
   */
  getBanner(slug: string): { titulo: string; bajada: string } {
    return BANNERS[slug] ?? { titulo: 'Categoría', bajada: '' };
  }

  /**
   * Filtra los productos que pertenecen a una categoría.
   * @param slug Identificador de la categoría.
   * @returns Productos de esa categoría.
   */
  getProductosPorCategoria(slug: string): Producto[] {
    return this.productos().filter(p => p.categoria === slug);
  }

  /**
   * Busca un producto por su identificador.
   * @param id Identificador del producto, o null si no viene en la URL.
   * @returns El producto encontrado o undefined si no existe.
   */
  getProductoPorId(id: string | null): Producto | undefined {
    return this.productos().find(p => p.id === id);
  }

  /**
   * Agrega un nuevo producto al catálogo con un id correlativo.
   * @param datos Datos del producto sin el id.
   * @returns El producto creado.
   */
  agregarProducto(datos: Omit<Producto, 'id'>): Producto {
    const nuevo: Producto = { ...datos, id: this.generarId() };
    this.productos.update(lista => [...lista, nuevo]);
    return nuevo;
  }

  /**
   * Actualiza un producto existente (lo reemplaza por su id).
   * @param producto Producto con los datos modificados.
   */
  actualizarProducto(producto: Producto): void {
    this.productos.update(lista =>
      lista.map(p => p.id === producto.id ? { ...producto } : p)
    );
  }

  /**
   * Elimina un producto del catálogo.
   * @param id Identificador del producto a eliminar.
   */
  eliminarProducto(id: string): void {
    this.productos.update(lista => lista.filter(p => p.id !== id));
  }

  /**
   * Calcula el porcentaje de descuento de un producto en oferta.
   * @param p Producto a evaluar.
   * @returns Porcentaje de descuento (0 si no está en oferta).
   */
  descuento(p: Producto): number {
    if (!p.precio_antiguo || p.precio_antiguo <= p.precio) {
      return 0;
    }
    return Math.round((1 - p.precio / p.precio_antiguo) * 100);
  }

  /**
   * Formatea un precio al estilo chileno.
   * @param n Monto a formatear.
   * @returns El monto con separador de miles, ej: "$31.990".
   */
  formatearPrecio(n: number): string {
    return '$' + Number(n).toLocaleString('es-CL');
  }

  /**
   * Resuelve la URL a usar en un `<img>` según el origen de la imagen.
   * Si es una imagen subida (Data URL) o externa la usa tal cual; si es una
   * ruta relativa del proyecto (ej: 'img/CATAN.jpg') le antepone '/'.
   * @param imagen Valor del campo imagen del producto.
   * @returns URL lista para el atributo src.
   */
  urlImagen(imagen: string): string {
    if (!imagen) {
      return '';
    }
    return /^(data:|https?:)/.test(imagen) ? imagen : '/' + imagen;
  }

  /**
   * Genera un id único para un producto nuevo (formato 'p-XXX').
   * @returns Nuevo identificador.
   */
  private generarId(): string {
    const numeros = this.productos()
      .map(p => parseInt(p.id.replace('p-', ''), 10))
      .filter(n => !isNaN(n));
    const max = numeros.length ? Math.max(...numeros) : 0;
    return 'p-' + String(max + 1).padStart(3, '0');
  }
}
