/* ============================================================
   Mesa Lúdica - Utilidades de almacenamiento
   DSY2202 - Experiencia 3, Semana 7

   Lectura y escritura en localStorage de forma segura. Están protegidas
   para no fallar durante el renderizado en servidor (SSR), donde el objeto
   `localStorage` no existe.
   ============================================================ */

/**
 * @description
 * Indica si `localStorage` está disponible (entorno navegador, no SSR).
 * @returns true si se puede usar `localStorage`.
 */
export function hayStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

/**
 * @description
 * Lee y parsea un valor guardado en `localStorage`.
 * @param clave Clave del valor a leer.
 * @param porDefecto Valor a devolver si no existe o no se puede parsear.
 * @returns El valor almacenado, o `porDefecto` si no hay dato válido.
 */
export function leerStorage<T>(clave: string, porDefecto: T): T {
  if (!hayStorage()) {
    return porDefecto;
  }
  const crudo = localStorage.getItem(clave);
  if (crudo === null) {
    return porDefecto;
  }
  try {
    return JSON.parse(crudo) as T;
  } catch {
    return porDefecto;
  }
}

/**
 * @description
 * Serializa y guarda un valor en `localStorage`.
 * @param clave Clave bajo la cual guardar.
 * @param valor Valor a serializar y almacenar.
 */
export function guardarStorage(clave: string, valor: unknown): void {
  if (!hayStorage()) {
    return;
  }
  localStorage.setItem(clave, JSON.stringify(valor));
}
