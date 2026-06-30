import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Página de modificación de perfil. Formulario reactivo precargado con los
 * datos del usuario que tiene la sesión iniciada, que permite editarlos con
 * validaciones y guardarlos en la sesión.
 */
@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil {
  private readonly auth = inject(AuthService);

  /** Datos actuales del usuario logueado, usados para precargar y restablecer. */
  private readonly datosActuales = {
    nombre: this.auth.usuario()?.nombre ?? '',
    usuario: this.auth.usuario()?.usuario ?? '',
    email: this.auth.usuario()?.email ?? '',
    telefono: this.auth.usuario()?.telefono ?? '',
    direccion: this.auth.usuario()?.direccion ?? ''
  };

  /** Formulario reactivo con los datos editables del perfil. */
  formulario: FormGroup;

  /** Se pone en true al intentar guardar, para desplegar los errores. */
  enviado = false;

  /** Indica que los cambios pasaron la validación (mensaje de éxito). */
  guardado = false;

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
   * errores; si es válido, actualiza los datos del usuario en la sesión.
   */
  guardar(): void {
    this.enviado = true;
    this.guardado = false;
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.value;
    this.auth.actualizarPerfil({
      nombre: v.nombre,
      usuario: v.usuario,
      email: v.email,
      telefono: v.telefono,
      direccion: v.direccion
    });
    this.guardado = true;
  }

  /** Restablece el formulario a los datos actuales del usuario. */
  restablecer(): void {
    this.formulario.reset(this.datosActuales);
    this.enviado = false;
    this.guardado = false;
  }
}
