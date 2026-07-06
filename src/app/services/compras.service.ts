/* ============================================================
   Mesa Lúdica - Servicio de compras
   DSY2202 - Experiencia 3, Semana 7

   Registra las compras (pagos simulados) para que cada usuario pueda
   monitorear su historial. El historial se persiste en localStorage para
   que no se pierda al recargar la página.
   ============================================================ */

import { Injectable, signal, effect } from '@angular/core';
import { ItemCarrito } from './carrito.service';
import { leerStorage, guardarStorage } from './storage.util';

/** Clave de localStorage para el historial de compras. */
const CLAVE_COMPRAS = 'ml_compras';

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
  /** Historial completo de compras (todos los usuarios), leído de localStorage. */
  private readonly historial = signal<Compra[]>(leerStorage<Compra[]>(CLAVE_COMPRAS, []));

  /** Correlativo para asignar id a cada nueva compra. */
  private siguienteId = 1;

  constructor() {
    // El id correlativo continúa a partir del mayor id ya guardado.
    this.siguienteId = this.historial().reduce((max, c) => Math.max(max, c.id), 0) + 1;
    // Persiste el historial en localStorage cada vez que cambia.
    effect(() => guardarStorage(CLAVE_COMPRAS, this.historial()));
  }

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
