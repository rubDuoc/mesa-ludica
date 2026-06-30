/* ============================================================
   Mesa Lúdica - Modelo de usuario y roles
   DSY2202 - Experiencia 2, Semana 6
   ============================================================ */

/**
 * @description
 * Roles disponibles en la aplicación, cada uno con privilegios distintos:
 * - `cliente`: navega el catálogo y compra.
 * - `admin`: además accede al mantenedor de productos.
 */
export type Rol = 'cliente' | 'admin';

/**
 * @description
 * Representa un usuario de la aplicación.
 */
export interface Usuario {
  /** Nombre visible del usuario. */
  nombre: string;
  /** Correo usado para iniciar sesión. */
  email: string;
  /** Contraseña (solo demostración, sin backend). */
  password: string;
  /** Rol que define sus privilegios. */
  rol: Rol;
}
