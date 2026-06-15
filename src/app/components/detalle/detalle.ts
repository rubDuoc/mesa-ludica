import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PRODUCTOS } from '../../data/productos';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-detalle',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle.html',
  styleUrl: './detalle.scss'
})
export class Detalle implements OnInit {
  producto?: Producto;

  constructor(private ruta: ActivatedRoute) {}

  ngOnInit(): void {
    // Recibe el id enviado desde la página de categoría (/detalle/:id)
    this.ruta.paramMap.subscribe(params => {
      const id = params.get('id');
      this.producto = PRODUCTOS.find(p => p.id === id);
    });
  }

  get descuento(): number {
    const p = this.producto;
    if (!p || !p.precio_antiguo || p.precio_antiguo <= p.precio) {
      return 0;
    }
    return Math.round((1 - p.precio / p.precio_antiguo) * 100);
  }

  formatearPrecio(n: number): string {
    return '$' + Number(n).toLocaleString('es-CL');
  }
}
