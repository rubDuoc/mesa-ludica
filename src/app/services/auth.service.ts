/* ============================================================
   Mesa Lúdica - Servicio de autenticación
   DSY2202 - Experiencia 3, Semana 8

   Los usuarios se CONSUMEN y se MANIPULAN (GET/PUT) desde la Realtime
   Database de Firebase a través de ApiService. La SESIÓN activa se guarda
   en localStorage para que sobreviva a las recargas y para que el menú y
   los guards puedan leerla de forma síncrona.
   ============================================================ */

import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Usuario } from '../models/usuario';
import { leerStorage, guardarStorage } from './storage.util';

/** Nodo de la Realtime Database donde viven los usuarios. */
const NODO = 'usuarios';
/** Clave de localStorage para la sesión activa. */
const CLAVE_SESION = 'ml_sesion';

/**
 * @description
 * Servicio de autenticación. Valida credenciales y registra usuarios contra
 * Firebase (Realtime Database) mediante REST, y mantiene la sesión activa en
 * un signal persistido en `localStorage`, de modo que el menú y las páginas
 * reaccionan a los cambios de sesión y de rol.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  /** Usuario con sesión activa (persistido en localStorage), o null si nadie inició sesión. */
  private readonly usuarioActual = signal<Usuario | null>(leerStorage<Usuario | null>(CLAVE_SESION, null));

  /** Usuario actual en modo solo lectura. */
  readonly usuario = this.usuarioActual.asReadonly();

  /** Indica si hay una sesión activa. */
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  /** Indica si el usuario actual tiene rol de administrador. */
  readonly esAdmin = computed(() => this.usuarioActual()?.rol === 'admin');

  constructor() {
    // Persiste la sesión en localStorage cada vez que cambia.
    effect(() => guardarStorage(CLAVE_SESION, this.usuarioActual()));
  }

  /**
   * Valida credenciales contra los usuarios de Firebase (GET) e inicia sesión.
   * @param email Correo ingresado.
   * @param password Contraseña ingresada.
   * @returns Observable con true si las credenciales son válidas; false si no.
   */
  login(email: string, password: string): Observable<boolean> {
    return this.api.get<Record<string, Usuario> | null>(NODO).pipe(
      map(obj => {
        const lista = obj ? Object.values(obj) : [];
        const encontrado = lista.find(u => u.email === email && u.password === password);
        if (encontrado) {
          this.usuarioActual.set(encontrado);
          return true;
        }
        return false;
      })
    );
  }

  /**
   * Registra un nuevo usuario (rol cliente) en Firebase (PUT) e inicia su sesión.
   * Antes valida (GET) que el correo no esté ya registrado.
   * @param datos Datos del nuevo usuario (nombre, correo y contraseña obligatorios).
   * @returns Observable con el usuario creado; error `EMAIL_EXISTENTE` si el correo ya existe.
   */
  registrar(datos: {
    nombre: string;
    email: string;
    password: string;
    usuario?: string;
    direccion?: string;
  }): Observable<Usuario> {
    return this.api.get<Record<string, Usuario> | null>(NODO).pipe(
      switchMap(obj => {
        const lista = obj ? Object.values(obj) : [];
        if (lista.some(u => u.email.toLowerCase() === datos.email.toLowerCase())) {
          return throwError(() => new Error('EMAIL_EXISTENTE'));
        }
        const nuevo: Usuario = { ...datos, id: this.generarId(lista), rol: 'cliente' };
        return this.api.put<Usuario>(`${NODO}/${nuevo.id}`, nuevo).pipe(
          map(() => nuevo),
          tap(u => this.usuarioActual.set(u))
        );
      })
    );
  }

  /**
   * Actualiza los datos del usuario con sesión activa en Firebase (PUT) y en la sesión.
   * @param datos Campos a modificar del usuario actual.
   * @returns Observable con el usuario actualizado; error `SIN_SESION` si nadie inició sesión.
   */
  actualizarPerfil(datos: Partial<Usuario>): Observable<Usuario> {
    const actual = this.usuarioActual();
    if (!actual) {
      return throwError(() => new Error('SIN_SESION'));
    }
    const actualizado: Usuario = { ...actual, ...datos };
    return this.api.put<Usuario>(`${NODO}/${actual.id}`, actualizado).pipe(
      map(() => actualizado),
      tap(u => this.usuarioActual.set(u))
    );
  }

  /** Cierra la sesión del usuario actual. */
  logout(): void {
    this.usuarioActual.set(null);
  }

  /**
   * Genera un id correlativo para un usuario nuevo (formato 'u-XXX').
   * @param lista Usuarios existentes de los que se calcula el siguiente id.
   * @returns Nuevo identificador.
   */
  private generarId(lista: Usuario[]): string {
    const numeros = lista
      .map(u => parseInt((u.id ?? '').replace('u-', ''), 10))
      .filter(n => !isNaN(n));
    const max = numeros.length ? Math.max(...numeros) : 0;
    return 'u-' + String(max + 1).padStart(3, '0');
  }
}
