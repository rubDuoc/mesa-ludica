import { Injectable, signal, computed, effect } from '@angular/core';
import { USUARIOS } from '../data/usuarios';
import { Usuario } from '../models/usuario';
import { leerStorage, guardarStorage } from './storage.util';

/** Clave de localStorage para la lista de usuarios registrados. */
const CLAVE_USUARIOS = 'ml_usuarios';
/** Clave de localStorage para la sesión activa. */
const CLAVE_SESION = 'ml_sesion';

/**
 * @description
 * Servicio de autenticación simulada. Mantiene el usuario con sesión iniciada
 * usando signals, de modo que el menú y las páginas reaccionan automáticamente
 * a los cambios de sesión y de rol. Los usuarios registrados y la sesión activa
 * se persisten en `localStorage`, para que no se pierdan al recargar la página.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Lista de usuarios: parte con los de demostración y crece con los registrados. */
  private readonly usuarios = signal<Usuario[]>(leerStorage(CLAVE_USUARIOS, [...USUARIOS]));

  /** Usuario con sesión activa, o null si nadie ha iniciado sesión. */
  private readonly usuarioActual = signal<Usuario | null>(leerStorage<Usuario | null>(CLAVE_SESION, null));

  /** Usuario actual en modo solo lectura. */
  readonly usuario = this.usuarioActual.asReadonly();

  /** Indica si hay una sesión activa. */
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  /** Indica si el usuario actual tiene rol de administrador. */
  readonly esAdmin = computed(() => this.usuarioActual()?.rol === 'admin');

  constructor() {
    // Persiste automáticamente en localStorage cada vez que cambian.
    effect(() => guardarStorage(CLAVE_USUARIOS, this.usuarios()));
    effect(() => guardarStorage(CLAVE_SESION, this.usuarioActual()));
  }

  /**
   * Valida credenciales contra los usuarios registrados e inicia sesión.
   * @param email Correo ingresado.
   * @param password Contraseña ingresada.
   * @returns true si las credenciales son válidas; false en caso contrario.
   */
  login(email: string, password: string): boolean {
    const encontrado = this.usuarios().find(u => u.email === email && u.password === password);
    if (encontrado) {
      this.usuarioActual.set(encontrado);
      return true;
    }
    return false;
  }

  /**
   * Indica si un correo ya está registrado (para evitar duplicados).
   * @param email Correo a comprobar.
   * @returns true si el correo ya existe.
   */
  emailRegistrado(email: string): boolean {
    return this.usuarios().some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Registra un nuevo usuario con rol cliente e inicia su sesión automáticamente.
   * @param datos Datos del nuevo usuario (nombre y correo obligatorios).
   * @returns El usuario creado.
   */
  registrar(datos: {
    nombre: string;
    email: string;
    password: string;
    usuario?: string;
    direccion?: string;
  }): Usuario {
    const nuevo: Usuario = { ...datos, rol: 'cliente' };
    this.usuarios.update(lista => [...lista, nuevo]);
    this.usuarioActual.set(nuevo);
    return nuevo;
  }

  /**
   * Actualiza los datos del usuario con sesión activa (perfil) y los refleja
   * también en la lista de usuarios.
   * @param datos Campos a modificar del usuario actual.
   */
  actualizarPerfil(datos: Partial<Usuario>): void {
    const actual = this.usuarioActual();
    if (!actual) {
      return;
    }
    const actualizado: Usuario = { ...actual, ...datos };
    this.usuarioActual.set(actualizado);
    this.usuarios.update(lista =>
      lista.map(u => u.email === actual.email ? actualizado : u)
    );
  }

  /** Cierra la sesión del usuario actual. */
  logout(): void {
    this.usuarioActual.set(null);
  }
}
