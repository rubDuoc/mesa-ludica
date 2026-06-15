import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PRODUCTOS, BANNERS } from '../../data/productos';
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

  constructor(private ruta: ActivatedRoute) {}

  ngOnInit(): void {
    // Reacciona al parámetro :nombre de la ruta /categoria/:nombre
    this.ruta.paramMap.subscribe(params => {
      this.slug = params.get('nombre') || '';
      const banner = BANNERS[this.slug];
      this.titulo = banner ? banner.titulo : 'Categoría';
      this.bajada = banner ? banner.bajada : '';
      // Filtra los datos estáticos por la categoría pedida
      this.productos = PRODUCTOS.filter(p => p.categoria === this.slug);
    });
  }

  // Calcula el porcentaje de descuento de un producto en oferta
  descuento(p: Producto): number {
    if (!p.precio_antiguo || p.precio_antiguo <= p.precio) {
      return 0;
    }
    return Math.round((1 - p.precio / p.precio_antiguo) * 100);
  }

  // Formatea un precio al estilo chileno: $31.990
  formatearPrecio(n: number): string {
    return '$' + Number(n).toLocaleString('es-CL');
  }
}
