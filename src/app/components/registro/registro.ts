import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuerzaContrasena, edadMinima, contrasenasIguales } from '../../validators/registro.validators';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  // Formulario reactivo: estructura y validaciones definidas en TypeScript.
  formulario: FormGroup;

  // Se pone en true al intentar enviar, para mostrar los errores aunque el
  // usuario no haya tocado los campos.
  enviado = false;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombre:              ['', [Validators.required, Validators.minLength(3)]],
      usuario:             ['', [Validators.required, Validators.minLength(4)]],
      email:               ['', [Validators.required, Validators.email]],
      contrasena:          ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), fuerzaContrasena]],
      confirmarContrasena: ['', [Validators.required]],
      nacimiento:          ['', [Validators.required, edadMinima(13)]],
      direccion:           ['']  // opcional: sin validadores
    }, { validators: contrasenasIguales });
  }

  // Accesos directos a los controles para mostrar errores en el HTML.
  get nombre()              { return this.formulario.get('nombre')!; }
  get usuario()             { return this.formulario.get('usuario')!; }
  get email()               { return this.formulario.get('email')!; }
  get contrasena()          { return this.formulario.get('contrasena')!; }
  get confirmarContrasena() { return this.formulario.get('confirmarContrasena')!; }
  get nacimiento()          { return this.formulario.get('nacimiento')!; }
  get direccion()           { return this.formulario.get('direccion')!; }

  // La vista previa aparece cuando hay algún dato escrito.
  get tieneDatos(): boolean {
    const v = this.formulario.value;
    return !!(v.nombre || v.usuario || v.email);
  }

  enviar(): void {
    this.enviado = true;
    if (this.formulario.invalid) {
      // Marca todo como "tocado" para que se muestren todos los mensajes.
      this.formulario.markAllAsTouched();
      return;
    }
    // En la Experiencia 3 estos datos se enviarían a la API REST.
  }

  limpiar(): void {
    this.formulario.reset();
    this.enviado = false;
  }
}
