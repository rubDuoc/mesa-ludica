import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ComprasService } from '../../services/compras.service';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';

/**
 * @description
 * Página de pago simulado. Muestra el resumen del carrito y, al confirmar,
 * registra la compra en el historial del usuario y vacía el carrito.
 * No integra pasarelas reales (WebPay u otras): el pago es solo demostrativo.
 */
@Component({
  selector: 'app-pago',
  imports: [CommonModule, RouterLink],
  templateUrl: './pago.html',
  styleUrl: './pago.scss'
})
export class Pago {
  /** Servicio del carrito (estado reactivo). */
  protected readonly carrito = inject(CarritoService);

  private readonly compras = inject(ComprasService);
  private readonly auth = inject(AuthService);
  private readonly productoService = inject(ProductoService);

  /** Indica que el pago se completó (muestra la pantalla de éxito). */
  pagado = false;

  /** Monto que se pagó (se guarda antes de vaciar el carrito). */
  totalPagado = 0;

  /**
   * Formatea un precio al estilo chileno (delegado al servicio de productos).
   * @param n Monto a formatear.
   * @returns El monto formateado, ej: "$31.990".
   */
  formatearPrecio(n: number): string {
    return this.productoService.formatearPrecio(n);
  }

  /**
   * Confirma el pago simulado: registra la compra en el historial del usuario
   * con sesión y vacía el carrito.
   */
  pagar(): void {
    const items = this.carrito.contenido();
    if (items.length === 0) {
      return;
    }
    this.totalPagado = this.carrito.total();
    const email = this.auth.usuario()?.email ?? 'desconocido';
    this.compras.registrar(email, items, this.totalPagado);
    this.carrito.vaciar();
    this.pagado = true;
  }
}
