import { Injectable, signal, computed } from '@angular/core';
import { USUARIOS } from '../data/usuarios';
import { Usuario } from '../models/usuario';

/**
 * @description
 * Servicio de autenticación simulada. Mantiene el usuario con sesión iniciada
 * usando signals, de modo que el menú y las páginas reaccionan automáticamente
 * a los cambios de sesión y de rol.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Usuario con sesión activa, o null si nadie ha iniciado sesión. */
  private readonly usuarioActual = signal<Usuario | null>(null);

  /** Usuario actual en modo solo lectura. */
  readonly usuario = this.usuarioActual.asReadonly();

  /** Indica si hay una sesión activa. */
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  /** Indica si el usuario actual tiene rol de administrador. */
  readonly esAdmin = computed(() => this.usuarioActual()?.rol === 'admin');

  /**
   * Valida credenciales contra los usuarios de demostración e inicia sesión.
   * @param email Correo ingresado.
   * @param password Contraseña ingresada.
   * @returns true si las credenciales son válidas; false en caso contrario.
   */
  login(email: string, password: string): boolean {
    const encontrado = USUARIOS.find(u => u.email === email && u.password === password);
    if (encontrado) {
      this.usuarioActual.set(encontrado);
      return true;
    }
    return false;
  }

  /** Cierra la sesión del usuario actual. */
  logout(): void {
    this.usuarioActual.set(null);
  }
}
