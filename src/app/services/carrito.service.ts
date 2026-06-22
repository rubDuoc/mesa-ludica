/* ============================================================
   Mesa Lúdica - Servicio de carrito
   DSY2202 - Experiencia 2

   Estado del carrito de compra usando signals de Angular: cualquier
   componente que lea totalItems() se actualiza solo cuando cambia.
   Es la base de la lógica de compra que se ampliará en las próximas
   semanas.
   ============================================================ */

import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../models/producto';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  /* Estado interno del carrito (solo el servicio lo modifica). */
  private readonly items = signal<ItemCarrito[]>([]);

  /* Lista de items en modo solo lectura, por si se quiere mostrar el carrito. */
  readonly contenido = this.items.asReadonly();

  /* Cantidad total de unidades, para el contador del header. */
  readonly totalItems = computed(() =>
    this.items().reduce((suma, item) => suma + item.cantidad, 0)
  );

  /* Agrega un producto: si ya está, suma una unidad; si no, lo crea. */
  agregar(producto: Producto): void {
    this.items.update(items => {
      const existente = items.find(i => i.producto.id === producto.id);
      if (existente) {
        return items.map(i =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...items, { producto, cantidad: 1 }];
    });
  }
}
