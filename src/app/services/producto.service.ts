/* ============================================================
   Mesa Lúdica - Servicio de productos
   DSY2202 - Experiencia 3, Semana 8

   El catálogo se CONSUME y se MANIPULA (GET/POST/PUT/DELETE) desde la
   Realtime Database de Firebase a través de ApiService. Se mantiene una
   copia reactiva en un signal para que las páginas y el mantenedor del
   admin trabajen sobre él sin repetir peticiones en cada lectura.
   ============================================================ */

import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, firstValueFrom, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { CATEGORIAS, BANNERS, PRODUCTOS } from '../data/productos';
import { Producto, Categoria } from '../models/producto';

/** Nodos de la Realtime Database que consume el catálogo. */
const NODO = 'productos';
const NODO_CATEGORIAS = 'categorias';
const NODO_BANNERS = 'banners';

/** Texto del banner de una categoría. */
type Banner = { titulo: string; bajada: string };

/**
 * @description
 * Servicio que centraliza el acceso al catálogo de productos y categorías.
 * El catálogo se consume desde Firebase (Realtime Database) con los métodos
 * REST y se mantiene en un signal para administrarlo (CRUD) desde el panel de
 * administración y para que las vistas reaccionen a los cambios.
 */
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly api = inject(ApiService);

  /** Estado del catálogo. Se llena al consumir Firebase (ver `cargarCatalogo`). */
  private readonly productos = signal<Producto[]>([]);

  /** Categorías del catálogo, también consumidas desde Firebase. */
  private readonly categorias = signal<Categoria[]>([]);

  /** Textos de banner por categoría, consumidos desde Firebase. */
  private readonly banners = signal<Record<string, Banner>>({});

  /** Catálogo en modo solo lectura (reactivo) para las vistas y el mantenedor. */
  readonly catalogo = this.productos.asReadonly();

  /** Cantidad de productos en el catálogo. */
  readonly totalProductos = computed(() => this.productos().length);

  /**
   * Consume desde Firebase, en paralelo, el catálogo, las categorías y los
   * banners, y los deja en sus signals. Se invoca en el arranque de la app
   * (`provideAppInitializer`) para que las páginas dispongan de los datos desde
   * el primer render. Si la petición falla (sin conexión), cae en los datos
   * estáticos de respaldo.
   * @returns Promesa que se resuelve cuando los datos quedaron cargados.
   */
  cargarCatalogo(): Promise<void> {
    return firstValueFrom(forkJoin({
      productos: this.getProductos(),
      categorias: this.api.get<Categoria[] | Record<string, Categoria> | null>(NODO_CATEGORIAS)
        .pipe(map(v => this.aArreglo(v))),
      banners: this.api.get<Record<string, Banner> | null>(NODO_BANNERS)
        .pipe(map(v => v ?? {}))
    }))
      .then(datos => {
        this.productos.set(datos.productos);
        this.categorias.set(datos.categorias);
        this.banners.set(datos.banners);
      })
      .catch(() => {
        this.productos.set([...PRODUCTOS]);
        this.categorias.set([...CATEGORIAS]);
        this.banners.set({ ...BANNERS });
      });
  }

  /**
   * Consume el catálogo desde Firebase (GET). Firebase devuelve un objeto
   * indexado por id (o null si el nodo está vacío), que se convierte en arreglo.
   * @returns Observable con el arreglo de productos.
   */
  getProductos(): Observable<Producto[]> {
    return this.api.get<Record<string, Producto> | null>(NODO).pipe(
      map(obj => (obj ? Object.values(obj) : []))
    );
  }

  /**
   * Devuelve todas las categorías que se muestran en la portada (desde Firebase).
   * @returns Arreglo de categorías del catálogo.
   */
  getCategorias(): Categoria[] {
    return this.categorias();
  }

  /**
   * Obtiene el texto del banner de una categoría (desde Firebase).
   * @param slug Identificador de la categoría (ej: 'estrategia').
   * @returns Título y bajada del banner; un valor por defecto si el slug no existe.
   */
  getBanner(slug: string): Banner {
    return this.banners()[slug] ?? { titulo: 'Categoría', bajada: '' };
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
   * Agrega un nuevo producto al catálogo con un id correlativo (POST/PUT).
   * Escribe en Firebase con `PUT productos/{id}` para conservar nuestro id, y
   * refleja el cambio en el signal cuando la operación se confirma.
   * @param datos Datos del producto sin el id.
   * @returns Observable con el producto creado.
   */
  agregarProducto(datos: Omit<Producto, 'id'>): Observable<Producto> {
    const nuevo: Producto = { ...datos, id: this.generarId() };
    return this.api.put<Producto>(`${NODO}/${nuevo.id}`, nuevo).pipe(
      map(() => nuevo),
      tap(p => this.productos.update(lista => [...lista, p]))
    );
  }

  /**
   * Actualiza un producto existente en Firebase (PUT) y en el signal.
   * @param producto Producto con los datos modificados.
   * @returns Observable con el producto actualizado.
   */
  actualizarProducto(producto: Producto): Observable<Producto> {
    return this.api.put<Producto>(`${NODO}/${producto.id}`, producto).pipe(
      map(() => producto),
      tap(p => this.productos.update(lista =>
        lista.map(actual => actual.id === p.id ? { ...p } : actual)))
    );
  }

  /**
   * Elimina un producto de Firebase (DELETE) y del signal.
   * @param id Identificador del producto a eliminar.
   * @returns Observable que completa cuando Firebase confirma el borrado.
   */
  eliminarProducto(id: string): Observable<null> {
    return this.api.delete(`${NODO}/${id}`).pipe(
      tap(() => this.productos.update(lista => lista.filter(p => p.id !== id)))
    );
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
   * Normaliza la respuesta de Firebase a un arreglo. Firebase devuelve un
   * arreglo si las claves son índices numéricos, o un objeto indexado si son
   * claves con nombre; en ambos casos aquí se obtiene el arreglo de valores.
   * @param valor Respuesta cruda de Firebase (arreglo, objeto o null).
   * @returns Arreglo de valores (vacío si no hay datos).
   */
  private aArreglo<T>(valor: T[] | Record<string, T> | null | undefined): T[] {
    if (Array.isArray(valor)) {
      return valor;
    }
    return valor ? Object.values(valor) : [];
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
