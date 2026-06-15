import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  // Variables enlazadas con [(ngModel)] a los campos del formulario.
  // Sin validaciones ni lógica de envío (fuera del alcance de esta semana).
  nombre = '';
  usuario = '';
  email = '';
  nacimiento = '';
  direccion = '';

  // Controla si la vista previa de datos se muestra (demostración de *ngIf)
  get tieneDatos(): boolean {
    return this.nombre !== '' || this.usuario !== '' || this.email !== '';
  }

  limpiar(): void {
    this.nombre = '';
    this.usuario = '';
    this.email = '';
    this.nacimiento = '';
    this.direccion = '';
  }
}
