import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';

/**
 * @description
 * Página de detalle de un producto. Recibe el `:id` por la URL, busca el
 * producto en el servicio y permite agregarlo al carrito.
 */
@Component({
  selector: 'app-detalle',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle.html',
  styleUrl: './detalle.scss'
})
export class Detalle implements OnInit {
  /** Producto mostrado; undefined si el id no existe. */
  producto?: Producto;
  /** Indica si el producto se acaba de agregar al carrito (mensaje de confirmación). */
  agregado = false;
  /** Indica que no se pudo agregar porque se alcanzó el stock disponible. */
  stockAlcanzado = false;

  /**
   * @param ruta Ruta activa, usada para leer el parámetro `:id`.
   * @param productoService Servicio que entrega el producto por id.
   * @param carrito Servicio del carrito de compra.
   */
  constructor(
    private ruta: ActivatedRoute,
    private productoService: ProductoService,
    private carrito: CarritoService
  ) {}

  /** Recibe el id desde la URL y carga el producto correspondiente. */
  ngOnInit(): void {
    this.ruta.paramMap.subscribe(params => {
      this.producto = this.productoService.getProductoPorId(params.get('id'));
      this.agregado = false;
      this.stockAlcanzado = false;
    });
  }

  /**
   * Descuento del producto actual.
   * @returns Porcentaje de descuento (0 si no hay producto u oferta).
   */
  get descuento(): number {
    return this.producto ? this.productoService.descuento(this.producto) : 0;
  }

  /**
   * Formatea un precio al estilo chileno (delegado al servicio).
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

  /**
   * Agrega el producto actual al carrito. Muestra la confirmación si se agregó,
   * o el aviso de stock agotado si ya se alcanzó el máximo disponible.
   */
  agregarAlCarrito(): void {
    if (!this.producto) {
      return;
    }
    const agregado = this.carrito.agregar(this.producto);
    this.agregado = agregado;
    this.stockAlcanzado = !agregado;
  }
}
