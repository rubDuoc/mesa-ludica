import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-categoria',
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria.html',
  styleUrl: './categoria.scss'
})
export class Categoria implements OnInit {
  slug = '';
  titulo = '';
  bajada = '';
  productos: Producto[] = [];

  constructor(
    private ruta: ActivatedRoute,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    // Reacciona al parámetro :nombre de la ruta /categoria/:nombre
    this.ruta.paramMap.subscribe(params => {
      this.slug = params.get('nombre') || '';
      const banner = this.productoService.getBanner(this.slug);
      this.titulo = banner.titulo;
      this.bajada = banner.bajada;
      // El servicio entrega los productos de la categoría pedida.
      this.productos = this.productoService.getProductosPorCategoria(this.slug);
    });
  }

  // Se delegan los cálculos al servicio para no repetir lógica.
  descuento(p: Producto): number {
    return this.productoService.descuento(p);
  }

  formatearPrecio(n: number): string {
    return this.productoService.formatearPrecio(n);
  }
}
