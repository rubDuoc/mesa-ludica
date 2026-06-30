/* ============================================================
   Mesa Lúdica - Servicio de compras
   DSY2202 - Experiencia 2, Semana 6

   Registra las compras (pagos simulados) para que cada usuario pueda
   monitorear su historial. En la Experiencia 3 esto irá a una API REST.
   ============================================================ */

import { Injectable, signal } from '@angular/core';
import { ItemCarrito } from './carrito.service';

/**
 * @description
 * Representa una compra realizada por un usuario.
 */
export interface Compra {
  /** Identificador de la compra (correlativo simple). */
  id: number;
  /** Correo del usuario que compró. */
  email: string;
  /** Fecha y hora de la compra. */
  fecha: Date;
  /** Líneas compradas (copia de los items del carrito). */
  items: ItemCarrito[];
  /** Monto total pagado. */
  total: number;
}

/**
 * @description
 * Servicio que mantiene el historial de compras simuladas usando signals.
 */
@Injectable({ providedIn: 'root' })
export class ComprasService {
  /** Historial completo de compras (todos los usuarios). */
  private readonly historial = signal<Compra[]>([]);

  /** Correlativo para asignar id a cada nueva compra. */
  private siguienteId = 1;

  /**
   * Registra una nueva compra en el historial.
   * @param email Correo del usuario que compra.
   * @param items Líneas del carrito compradas.
   * @param total Monto total pagado.
   * @returns La compra registrada.
   */
  registrar(email: string, items: ItemCarrito[], total: number): Compra {
    const compra: Compra = {
      id: this.siguienteId++,
      email,
      fecha: new Date(),
      items: items.map(i => ({ ...i })),
      total
    };
    this.historial.update(h => [compra, ...h]);
    return compra;
  }

  /**
   * Obtiene las compras de un usuario, de la más reciente a la más antigua.
   * @param email Correo del usuario.
   * @returns Compras asociadas a ese correo.
   */
  comprasDe(email: string): Compra[] {
    return this.historial().filter(c => c.email === email);
  }
}
