import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

/**
 * @description
 * Página de catálogo consumido desde el JSON. Se suscribe al `Observable` de
 * `ProductoService.getProductos()` (que realiza un GET al archivo JSON con
 * `HttpClient`) y muestra los productos en una tabla. Usa `*ngIf/else` con la
 * plantilla `#noData` para mostrar un mensaje alternativo cuando no hay datos.
 */
@Component({
  selector: 'app-catalogo-api',
  imports: [CommonModule],
  templateUrl: './catalogo-api.html',
  styleUrl: './catalogo-api.scss'
})
export class CatalogoApi implements OnInit {
  private readonly productoService = inject(ProductoService);

  /** Productos consumidos desde el archivo JSON. */
  productos: Producto[] = [];
  /** Indica que la petición HTTP está en curso. */
  cargando = true;
  /** Indica que la petición falló. */
  error = false;

  /** Se suscribe al Observable del servicio y carga los datos del JSON al iniciar. */
  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: data => {
        this.productos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      }
    });
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
   * Resuelve la URL de la imagen del producto (delegado al servicio).
   * @param imagen Valor del campo imagen.
   * @returns URL lista para el atributo src.
   */
  urlImagen(imagen: string): string {
    return this.productoService.urlImagen(imagen);
  }
}
