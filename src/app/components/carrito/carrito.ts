import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';

/**
 * @description
 * Página del carrito de compra. Lista los productos agregados, permite cambiar
 * cantidades o quitarlos, muestra el total y deriva al pago.
 */
@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss'
})
export class Carrito {
  /** Servicio del carrito (estado reactivo). */
  protected readonly carrito = inject(CarritoService);

  private readonly productoService = inject(ProductoService);

  /**
   * Formatea un precio al estilo chileno (delegado al servicio de productos).
   * @param n Monto a formatear.
   * @returns El monto formateado, ej: "$31.990".
   */
  formatearPrecio(n: number): string {
    return this.productoService.formatearPrecio(n);
  }

  /**
   * Resuelve la URL de la imagen del producto (ruta o Data URL).
   * @param imagen Valor del campo imagen.
   * @returns URL lista para el atributo src.
   */
  urlImagen(imagen: string): string {
    return this.productoService.urlImagen(imagen);
  }
}
