/* ============================================================
   Mesa Lúdica - Servicio de compras
   DSY2202 - Experiencia 3, Semana 8

   Registra y consulta las compras (pagos simulados) desde la Realtime
   Database de Firebase mediante REST (GET/PUT). Cada compra queda asociada
   al correo del usuario, para que pueda monitorear su historial.
   ============================================================ */

import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ItemCarrito } from './carrito.service';

/** Nodo de la Realtime Database donde vive el historial de compras. */
const NODO = 'compras';

/**
 * @description
 * Representa una compra realizada por un usuario.
 */
export interface Compra {
  /** Identificador de la compra en Firebase (ej: 'c-001'). */
  id: string;
  /** Correo del usuario que compró. */
  email: string;
  /** Fecha y hora de la compra en formato ISO. */
  fecha: string;
  /** Líneas compradas (copia de los items del carrito). */
  items: ItemCarrito[];
  /** Monto total pagado. */
  total: number;
}

/**
 * @description
 * Servicio que registra las compras en Firebase (PUT) y consulta el historial
 * (GET). Mantiene una copia reactiva en un signal para que la vista "Mis
 * compras" muestre los datos sin repetir peticiones en cada lectura.
 */
@Injectable({ providedIn: 'root' })
export class ComprasService {
  private readonly api = inject(ApiService);

  /** Historial completo de compras (todos los usuarios), cargado desde Firebase. */
  private readonly historial = signal<Compra[]>([]);

  /**
   * Carga el historial completo desde Firebase (GET) al signal.
   * @returns Observable con el arreglo de compras.
   */
  cargarHistorial(): Observable<Compra[]> {
    return this.api.get<Record<string, Compra> | null>(NODO).pipe(
      map(obj => (obj ? Object.values(obj) : [])),
      tap(lista => this.historial.set(lista))
    );
  }

  /**
   * Registra una nueva compra en Firebase (PUT con id correlativo). Antes hace
   * un GET para calcular el siguiente id.
   * @param email Correo del usuario que compra.
   * @param items Líneas del carrito compradas.
   * @param total Monto total pagado.
   * @returns Observable con la compra registrada.
   */
  registrar(email: string, items: ItemCarrito[], total: number): Observable<Compra> {
    return this.api.get<Record<string, Compra> | null>(NODO).pipe(
      switchMap(obj => {
        const lista = obj ? Object.values(obj) : [];
        const compra: Compra = {
          id: this.generarId(lista),
          email,
          fecha: new Date().toISOString(),
          items: items.map(i => ({ ...i })),
          total
        };
        return this.api.put<Compra>(`${NODO}/${compra.id}`, compra).pipe(
          map(() => compra),
          tap(c => this.historial.update(h => [c, ...h]))
        );
      })
    );
  }

  /**
   * Obtiene las compras de un usuario, de la más reciente a la más antigua.
   * @param email Correo del usuario.
   * @returns Compras asociadas a ese correo.
   */
  comprasDe(email: string): Compra[] {
    return this.historial()
      .filter(c => c.email === email)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  /**
   * Genera un id correlativo para una compra nueva (formato 'c-XXX').
   * @param lista Compras existentes de las que se calcula el siguiente id.
   * @returns Nuevo identificador.
   */
  private generarId(lista: Compra[]): string {
    const numeros = lista
      .map(c => parseInt((c.id ?? '').replace('c-', ''), 10))
      .filter(n => !isNaN(n));
    const max = numeros.length ? Math.max(...numeros) : 0;
    return 'c-' + String(max + 1).padStart(3, '0');
  }
}
