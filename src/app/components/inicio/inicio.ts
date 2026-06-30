import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Categoria } from '../../models/producto';

/**
 * @description
 * Página de inicio. Muestra el hero de bienvenida y la grilla de las cuatro
 * categorías del catálogo, que se recorren con `*ngFor`.
 */
@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {
  /** Categorías a mostrar en la portada. */
  categorias: Categoria[] = [];

  /**
   * @param productoService Servicio que entrega las categorías del catálogo.
   */
  constructor(private productoService: ProductoService) {}

  /** Carga las categorías desde el servicio al iniciar el componente. */
  ngOnInit(): void {
    this.categorias = this.productoService.getCategorias();
  }
}
