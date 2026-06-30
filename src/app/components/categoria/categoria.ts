import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

/**
 * @description
 * Página de catálogo de una categoría. Lee el parámetro `:nombre` de la ruta,
 * arma el banner y lista los productos de esa categoría con `*ngFor` y `*ngIf`.
 */
@Component({
  selector: 'app-categoria',
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria.html',
  styleUrl: './categoria.scss'
})
export class Categoria implements OnInit {
  /** Identificador de la categoría actual (desde la URL). */
  slug = '';
  /** Título del banner de la categoría. */
  titulo = '';
  /** Bajada o subtítulo del banner. */
  bajada = '';
  /** Productos de la categoría actual. */
  productos: Producto[] = [];

  /**
   * @param ruta Ruta activa, usada para leer el parámetro `:nombre`.
   * @param productoService Servicio que entrega banner y productos.
   */
  constructor(
    private ruta: ActivatedRoute,
    private productoService: ProductoService
  ) {}

  /** Reacciona al parámetro `:nombre` y carga banner y productos de la categoría. */
  ngOnInit(): void {
    this.ruta.paramMap.subscribe(params => {
      this.slug = params.get('nombre') || '';
      const banner = this.productoService.getBanner(this.slug);
      this.titulo = banner.titulo;
      this.bajada = banner.bajada;
      this.productos = this.productoService.getProductosPorCategoria(this.slug);
    });
  }

  /**
   * Calcula el descuento de un producto (delegado al servicio).
   * @param p Producto a evaluar.
   * @returns Porcentaje de descuento (0 si no hay oferta).
   */
  descuento(p: Producto): number {
    return this.productoService.descuento(p);
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
}
