import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Categoria } from '../../models/producto';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio implements OnInit {
  // Las categorías se piden al servicio y se recorren con *ngFor en el HTML.
  categorias: Categoria[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.categorias = this.productoService.getCategorias();
  }
}
