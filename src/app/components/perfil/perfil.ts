import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @description
 * Página de modificación de perfil. Formulario reactivo precargado con los
 * datos actuales del usuario (simulados) que permite editarlos con validaciones.
 */
@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {
  /** Formulario reactivo con los datos editables del perfil. */
  formulario: FormGroup;

  /** Se pone en true al intentar guardar, para desplegar los errores. */
  enviado = false;

  /** Indica que los cambios pasaron la validación (mensaje de éxito). */
  guardado = false;

  /** Datos actuales del usuario (simulados), usados para precargar el formulario. */
  private readonly datosActuales = {
    nombre: 'Rubén Oyarzún',
    usuario: 'ruben',
    email: 'ruben@correo.cl',
    telefono: '912345678',
    direccion: 'Av. Siempre Viva 742'
  };

  /**
   * @param fb Constructor de formularios reactivos de Angular.
   */
  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      nombre:    [this.datosActuales.nombre,   [Validators.required, Validators.minLength(3)]],
      usuario:   [this.datosActuales.usuario,  [Validators.required, Validators.minLength(4)]],
      email:     [this.datosActuales.email,    [Validators.required, Validators.email]],
      telefono:  [this.datosActuales.telefono, [Validators.required, Validators.pattern(/^[0-9]{8,9}$/)]],
      direccion: [this.datosActuales.direccion] // opcional
    });
  }

  /** Acceso directo al control nombre. */
  get nombre()    { return this.formulario.get('nombre')!; }
  /** Acceso directo al control usuario. */
  get usuario()   { return this.formulario.get('usuario')!; }
  /** Acceso directo al control email. */
  get email()     { return this.formulario.get('email')!; }
  /** Acceso directo al control telefono. */
  get telefono()  { return this.formulario.get('telefono')!; }

  /**
   * Guarda los cambios del perfil. Si el formulario es inválido muestra los
   * errores; si es válido, simula el guardado.
   */
  guardar(): void {
    this.enviado = true;
    this.guardado = false;
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.guardado = true;
  }

  /** Restablece el formulario a los datos actuales del usuario. */
  restablecer(): void {
    this.formulario.reset(this.datosActuales);
    this.enviado = false;
    this.guardado = false;
  }
}
