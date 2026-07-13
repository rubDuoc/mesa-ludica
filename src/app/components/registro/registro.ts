import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { fuerzaContrasena, edadMinima, contrasenasIguales } from '../../validators/registro.validators';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Página de registro de usuarios. Implementa un formulario reactivo con
 * validaciones definidas en TypeScript (campos obligatorios, formato de correo,
 * fuerza y coincidencia de contraseñas, y edad mínima).
 *
 * @usageNotes
 * Los validadores personalizados viven en `validators/registro.validators.ts`
 * para poder reutilizarse en otros formularios y probarse por separado.
 */
@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  /** Formulario reactivo con la estructura y validaciones del registro. */
  formulario: FormGroup;

  /** Se pone en true al intentar enviar, para forzar el despliegue de errores. */
  enviado = false;

  /** Controla si la contraseña se muestra en texto plano (botón del ojo). */
  verContrasena = false;

  /** Controla si la confirmación de contraseña se muestra en texto plano. */
  verConfirmar = false;

  /** Indica que el correo ingresado ya está registrado. */
  emailExistente = false;

  /** true mientras se registra el usuario en Firebase. */
  cargando = false;

  /** Indica un fallo de red al consultar Firebase. */
  errorRed = false;

  /**
   * @param fb Constructor de formularios reactivos de Angular.
   * @param auth Servicio de autenticación (registro e inicio de sesión).
   * @param router Router para redirigir tras un registro exitoso.
   */
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
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

  /**
   * Indica si mostrar la vista previa (hay al menos un dato escrito).
   * @returns true si nombre, usuario o correo tienen contenido.
   */
  get tieneDatos(): boolean {
    const v = this.formulario.value;
    return !!(v.nombre || v.usuario || v.email);
  }

  /**
   * Maneja el envío del formulario. Si es inválido, muestra los errores. Si el
   * correo ya existe, lo avisa. Si todo está correcto, crea la cuenta (rol
   * cliente), inicia sesión automáticamente y redirige al inicio.
   */
  enviar(): void {
    this.enviado = true;
    this.emailExistente = false;
    this.errorRed = false;
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.value;
    this.cargando = true;
    this.auth.registrar({
      nombre: v.nombre,
      usuario: v.usuario,
      email: v.email,
      password: v.contrasena,
      direccion: v.direccion
    }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/inicio']);
      },
      error: (e: Error) => {
        this.cargando = false;
        if (e.message === 'EMAIL_EXISTENTE') {
          this.emailExistente = true;
        } else {
          this.errorRed = true;
        }
      }
    });
  }

  /** Reinicia el formulario a su estado inicial y oculta los errores. */
  limpiar(): void {
    this.formulario.reset();
    this.enviado = false;
  }
}
