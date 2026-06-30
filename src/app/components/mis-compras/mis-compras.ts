import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComprasService, Compra } from '../../services/compras.service';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';

/**
 * @description
 * Página de monitoreo de compras del usuario con sesión. Lista las compras
 * (pagos simulados) que ha realizado, con su detalle y total.
 */
@Component({
  selector: 'app-mis-compras',
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.scss'
})
export class MisCompras {
  private readonly compras = inject(ComprasService);
  private readonly auth = inject(AuthService);
  private readonly productoService = inject(ProductoService);

  /**
   * Compras del usuario con sesión activa.
   * @returns Listado de compras del usuario actual.
   */
  get misCompras(): Compra[] {
    const email = this.auth.usuario()?.email ?? '';
    return this.compras.comprasDe(email);
  }

  /**
   * Formatea un precio al estilo chileno (delegado al servicio de productos).
   * @param n Monto a formatear.
   * @returns El monto formateado, ej: "$31.990".
   */
  formatearPrecio(n: number): string {
    return this.productoService.formatearPrecio(n);
  }
}
