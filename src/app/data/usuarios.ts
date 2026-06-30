/* ============================================================
   Mesa Lúdica - Usuarios de demostración
   DSY2202 - Experiencia 2, Semana 6

   Cuentas simuladas para probar los dos roles. En la Experiencia 3
   estos datos vendrán de una API REST.
   ============================================================ */

import { Usuario } from '../models/usuario';

/**
 * @description
 * Usuarios de demostración con sus roles. Sirven para iniciar sesión y
 * comprobar los privilegios de cada rol.
 */
export const USUARIOS: Usuario[] = [
  {
    nombre: 'Administrador', usuario: 'admin', email: 'admin@mesaludica.cl',
    password: 'Admin123!', telefono: '900000000', direccion: 'Oficina central', rol: 'admin'
  },
  {
    nombre: 'Cliente Demo', usuario: 'clientedemo', email: 'cliente@correo.cl',
    password: 'Cliente123!', telefono: '912345678', direccion: 'Av. Siempre Viva 742', rol: 'cliente'
  }
];
