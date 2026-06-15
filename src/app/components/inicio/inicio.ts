import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CATEGORIAS } from '../../data/productos';
import { Categoria } from '../../models/producto';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {
  // Datos estáticos: las 4 categorías que se recorren con *ngFor en el HTML
  categorias: Categoria[] = CATEGORIAS;
}
