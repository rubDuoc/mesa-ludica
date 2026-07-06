/* ============================================================
   Mesa Lúdica - Servicio de carrito
   DSY2202 - Experiencia 3, Semana 7

   Estado del carrito de compra usando signals de Angular: cualquier
   componente que lea totalItems()/total() se actualiza solo cuando
   cambia el contenido del carrito. El contenido se persiste en
   localStorage y las cantidades se limitan al stock disponible.
   ============================================================ */

import { Injectable, signal, computed, effect } from '@angular/core';
import { Producto } from '../models/producto';
import { leerStorage, guardarStorage } from './storage.util';

/** Clave de localStorage para el contenido del carrito. */
const CLAVE_CARRITO = 'ml_carrito';

/**
 * @description
 * Representa una línea del carrito: un producto y la cantidad agregada.
 */
export interface ItemCarrito {
  /** Producto agregado al carrito. */
  producto: Producto;
  /** Número de unidades de ese producto. */
  cantidad: number;
}

/**
 * @description
 * Servicio que mantiene el estado del carrito de compra usando signals de
 * Angular. Cualquier componente que lea `totalItems()` o `total()` se
 * actualiza solo cuando cambia el contenido del carrito.
 */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  /** Estado interno del carrito (solo el servicio lo modifica), leído de localStorage. */
  private readonly items = signal<ItemCarrito[]>(leerStorage<ItemCarrito[]>(CLAVE_CARRITO, []));

  /** Lista de items en modo solo lectura, para mostrar el carrito. */
  readonly contenido = this.items.asReadonly();

  constructor() {
    // Persiste el contenido del carrito en localStorage cada vez que cambia.
    effect(() => guardarStorage(CLAVE_CARRITO, this.items()));
  }

  /** Cantidad total de unidades en el carrito, para el contador del header. */
  readonly totalItems = computed(() =>
    this.items().reduce((suma, item) => suma + item.cantidad, 0)
  );

  /** Monto total del carrito en pesos (precio × cantidad de cada línea). */
  readonly total = computed(() =>
    this.items().reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0)
  );

  /**
   * Agrega un producto al carrito.
   * Si el producto ya está, suma una unidad; si no, lo crea con cantidad 1.
   * No permite superar el stock disponible del producto.
   * @param producto Producto a agregar.
   * @returns true si se agregó; false si ya se alcanzó el stock disponible.
   */
  agregar(producto: Producto): boolean {
    const existente = this.items().find(i => i.producto.id === producto.id);
    const enCarrito = existente?.cantidad ?? 0;
    if (enCarrito >= producto.stock) {
      return false;
    }
    this.items.update(items => {
      if (existente) {
        return items.map(i =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...items, { producto, cantidad: 1 }];
    });
    return true;
  }

  /**
   * Aumenta en uno la cantidad de un producto del carrito, sin superar su stock.
   * @param productoId Id del producto a incrementar.
   */
  incrementar(productoId: string): void {
    this.items.update(items =>
      items.map(i =>
        i.producto.id === productoId && i.cantidad < i.producto.stock
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      )
    );
  }

  /**
   * Disminuye en uno la cantidad de un producto; si llega a 0, lo elimina.
   * @param productoId Id del producto a disminuir.
   */
  decrementar(productoId: string): void {
    this.items.update(items =>
      items
        .map(i => i.producto.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i)
        .filter(i => i.cantidad > 0)
    );
  }

  /**
   * Quita por completo un producto del carrito.
   * @param productoId Id del producto a quitar.
   */
  quitar(productoId: string): void {
    this.items.update(items => items.filter(i => i.producto.id !== productoId));
  }

  /** Vacía el carrito por completo (por ejemplo, tras pagar). */
  vaciar(): void {
    this.items.set([]);
  }
}
