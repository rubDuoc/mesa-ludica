import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

/**
 * @description
 * Página de recuperación de contraseña. El usuario ingresa su correo y, si es
 * válido, se simula el envío de un enlace de recuperación.
 */
@Component({
  selector: 'app-recuperar',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.scss'
})
export class Recuperar {
  /** Formulario reactivo con el campo de correo. */
  formulario: FormGroup;

  /** Se pone en true al intentar enviar, para desplegar los errores. */
  enviado = false;

  /** Indica que el correo era válido y se simuló el envío del enlace. */
  enlaceEnviado = false;

  /**
   * @param fb Constructor de formularios reactivos de Angular.
   */
  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /** Acceso directo al control de correo para mostrar errores en el HTML. */
  get email() { return this.formulario.get('email')!; }

  /**
   * Maneja el envío. Si el correo es válido, simula el envío del enlace de
   * recuperación; si no, muestra el error.
   */
  enviarEnlace(): void {
    this.enviado = true;
    this.enlaceEnviado = false;
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enlaceEnviado = true;
  }
}
