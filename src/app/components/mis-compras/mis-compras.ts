import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComprasService, Compra } from '../../services/compras.service';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';

/**
 * @description
 * Página de monitoreo de compras del usuario con sesión. Carga el historial
 * desde Firebase (GET) al iniciar y lista las compras que ha realizado el
 * usuario, con su detalle y total.
 */
@Component({
  selector: 'app-mis-compras',
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.scss'
})
export class MisCompras implements OnInit {
  private readonly compras = inject(ComprasService);
  private readonly auth = inject(AuthService);
  private readonly productoService = inject(ProductoService);

  /** Indica que el historial se está cargando desde Firebase. */
  cargando = true;

  /** Indica que la carga del historial falló. */
  error = false;

  /** Carga el historial de compras desde Firebase al iniciar. */
  ngOnInit(): void {
    this.compras.cargarHistorial().subscribe({
      next: () => { this.cargando = false; },
      error: () => { this.error = true; this.cargando = false; }
    });
  }

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
