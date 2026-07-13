/* ============================================================
   Mesa Lúdica - Cliente REST genérico
   DSY2202 - Experiencia 3, Semana 8

   Encapsula el consumo de la Realtime Database de Firebase mediante
   HttpClient. Ofrece los métodos HTTP (GET/POST/PUT/PATCH/DELETE) sobre
   un nodo, agregando el sufijo `.json` que exige la API REST de Firebase.
   Los servicios de dominio (productos, usuarios, compras) lo reutilizan.
   ============================================================ */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FIREBASE_DB_URL } from './firebase.config';

/**
 * @description
 * Cliente REST genérico para la Realtime Database de Firebase. Centraliza la
 * construcción de URLs (`<base>/<ruta>.json`) y la inyección de `HttpClient`,
 * de modo que los servicios de dominio solo indican el nodo y el método.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  /**
   * Construye la URL REST de un nodo de Firebase.
   * @param ruta Nodo a consultar (ej: 'productos' o 'productos/p-001').
   * @returns URL completa con el sufijo `.json`.
   */
  private url(ruta: string): string {
    return `${FIREBASE_DB_URL}/${ruta}.json`;
  }

  /**
   * GET: obtiene el contenido de un nodo.
   * @param ruta Nodo a leer (ej: 'productos').
   * @returns Observable con el dato (objeto indexado, valor o null si está vacío).
   */
  get<T>(ruta: string): Observable<T> {
    return this.http.get<T>(this.url(ruta));
  }

  /**
   * PUT: crea o reemplaza por completo el contenido de un nodo.
   * @param ruta Nodo a escribir (ej: 'productos/p-001').
   * @param dato Objeto a almacenar.
   * @returns Observable con el dato almacenado.
   */
  put<T>(ruta: string, dato: T): Observable<T> {
    return this.http.put<T>(this.url(ruta), dato);
  }

  /**
   * POST: agrega un hijo con clave autogenerada por Firebase.
   * @param ruta Nodo colección (ej: 'compras').
   * @param dato Objeto a agregar.
   * @returns Observable con `{ name }`, la clave que generó Firebase.
   */
  post<T>(ruta: string, dato: T): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(this.url(ruta), dato);
  }

  /**
   * PATCH: actualiza parcialmente el contenido de un nodo.
   * @param ruta Nodo a modificar (ej: 'usuarios/u-001').
   * @param dato Campos a actualizar.
   * @returns Observable con los campos actualizados.
   */
  patch<T>(ruta: string, dato: Partial<T>): Observable<Partial<T>> {
    return this.http.patch<Partial<T>>(this.url(ruta), dato);
  }

  /**
   * DELETE: elimina el contenido de un nodo.
   * @param ruta Nodo a eliminar (ej: 'productos/p-001').
   * @returns Observable que completa cuando Firebase confirma el borrado.
   */
  delete(ruta: string): Observable<null> {
    return this.http.delete<null>(this.url(ruta));
  }
}
