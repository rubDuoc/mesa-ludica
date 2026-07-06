/* ============================================================
   Mesa Lúdica - Servicio de productos
   DSY2202 - Experiencia 3, Semana 7

   Centraliza el acceso al catálogo. En la Experiencia 3 el catálogo se
   CONSUME desde un archivo JSON (public/data/productos.json) mediante
   HttpClient y se vuelca a un signal, de modo que las páginas y el
   mantenedor del admin siguen trabajando de forma reactiva sobre él.
   ============================================================ */

import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { CATEGORIAS, BANNERS, PRODUCTOS } from '../data/productos';
import { Producto, Categoria } from '../models/producto';
import { leerStorage, guardarStorage } from './storage.util';

/** Clave de localStorage donde se guardan los cambios del catálogo (mantenedor). */
const CLAVE_CATALOGO = 'ml_catalogo';

/**
 * @description
 * Servicio que centraliza el acceso al catálogo de productos y categorías.
 * El catálogo se consume desde un archivo JSON con `HttpClient` y se mantiene
 * en un signal para poder administrarlo (CRUD) desde el panel de administración
 * y para que las vistas reaccionen a los cambios.
 */
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);

  /** URL del archivo JSON del catálogo (servido desde la carpeta `public`). */
  private readonly jsonUrl = '/data/productos.json';

  /** Estado del catálogo. Se llena al consumir el JSON (ver `cargarCatalogo`). */
  private readonly productos = signal<Producto[]>([]);

  /** Catálogo en modo solo lectura (reactivo) para el mantenedor. */
  readonly catalogo = this.productos.asReadonly();

  /** Cantidad de productos en el catálogo. */
  readonly totalProductos = computed(() => this.productos().length);

  constructor() {
    // Persiste los cambios del catálogo (mantenedor) en localStorage.
    // Se ignora el estado inicial vacío para no pisar lo ya guardado.
    effect(() => {
      const lista = this.productos();
      if (lista.length > 0) {
        guardarStorage(CLAVE_CATALOGO, lista);
      }
    });
  }

  /**
   * Deja el catálogo disponible en el signal. Si el mantenedor ya guardó
   * cambios en `localStorage` usa esos; si no, consume el archivo JSON vía
   * `HttpClient` (la semilla del catálogo). Se invoca en el arranque de la app
   * (`provideAppInitializer`) para que las páginas dispongan de los datos desde
   * el primer render. Si la petición falla, cae en los datos estáticos.
   * @returns Promesa que se resuelve cuando el catálogo quedó cargado.
   */
  cargarCatalogo(): Promise<void> {
    const guardado = leerStorage<Producto[]>(CLAVE_CATALOGO, []);
    if (guardado.length > 0) {
      this.productos.set(guardado);
      return Promise.resolve();
    }
    return firstValueFrom(this.http.get<Producto[]>(this.jsonUrl))
      .then(data => { this.productos.set(data); })
      .catch(() => { this.productos.set([...PRODUCTOS]); });
  }

  /**
   * Expone el catálogo como `Observable` para que un componente pueda
   * suscribirse directamente (patrón de consumo de la Experiencia 3).
   * @returns Observable con el arreglo de productos del JSON.
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.jsonUrl);
  }

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
