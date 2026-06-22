import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-detalle',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle.html',
  styleUrl: './detalle.scss'
})
export class Detalle implements OnInit {
  producto?: Producto;
  agregado = false;

  constructor(
    private ruta: ActivatedRoute,
    private productoService: ProductoService,
    private carrito: CarritoService
  ) {}

  ngOnInit(): void {
    // Recibe el id enviado desde la página de categoría (/detalle/:id)
    this.ruta.paramMap.subscribe(params => {
      this.producto = this.productoService.getProductoPorId(params.get('id'));
      this.agregado = false;
    });
  }

  get descuento(): number {
    return this.producto ? this.productoService.descuento(this.producto) : 0;
  }

  formatearPrecio(n: number): string {
    return this.productoService.formatearPrecio(n);
  }

  // Acción inicial de compra: suma el producto al carrito y confirma en pantalla.
  agregarAlCarrito(): void {
    if (this.producto && this.producto.stock > 0) {
      this.carrito.agregar(this.producto);
      this.agregado = true;
    }
  }
}
