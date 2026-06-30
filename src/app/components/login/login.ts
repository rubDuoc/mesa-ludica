import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * @description
 * Página de inicio de sesión. Formulario reactivo con validaciones de correo
 * y contraseña que autentica contra el `AuthService` (sesión simulada) y, si
 * las credenciales son válidas, redirige al inicio.
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  /** Formulario reactivo con los campos de inicio de sesión. */
  formulario: FormGroup;

  /** Se pone en true al intentar enviar, para desplegar los errores. */
  enviado = false;

  /** Indica que las credenciales no coinciden con ningún usuario. */
  credencialesInvalidas = false;

  /** Controla si la contraseña se muestra en texto plano (botón del ojo). */
  verContrasena = false;

  /**
   * @param fb Constructor de formularios reactivos de Angular.
   * @param auth Servicio de autenticación.
   * @param router Router para redirigir tras un login exitoso.
   */
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      email:      ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  /** Acceso directo al control de correo para mostrar errores en el HTML. */
  get email()      { return this.formulario.get('email')!; }
  /** Acceso directo al control de contraseña. */
  get contrasena() { return this.formulario.get('contrasena')!; }

  /**
   * Maneja el envío del formulario. Si es inválido muestra los errores; si es
   * válido, autentica y redirige al inicio o muestra "credenciales inválidas".
   */
  iniciarSesion(): void {
    this.enviado = true;
    this.credencialesInvalidas = false;
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const ok = this.auth.login(this.email.value, this.contrasena.value);
    if (ok) {
      this.router.navigate(['/inicio']);
    } else {
      this.credencialesInvalidas = true;
    }
  }

  /** Limpia el formulario y oculta mensajes. */
  limpiar(): void {
    this.formulario.reset();
    this.enviado = false;
    this.credencialesInvalidas = false;
  }
}
