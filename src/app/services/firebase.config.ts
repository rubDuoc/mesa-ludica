/* ============================================================
   Mesa Lúdica - Configuración de la API (Firebase Realtime DB)
   DSY2202 - Experiencia 3, Semana 8

   URL base de la Realtime Database. Centralizarla aquí permite
   cambiar el backend (JSON local, otra URL o una API real) sin
   tocar los servicios que la consumen.
   ============================================================ */

/**
 * @description
 * URL base de la Realtime Database de Firebase. Los servicios de dominio
 * arman las rutas REST agregando el nodo y el sufijo `.json` que exige la
 * API REST de Firebase (ej: `${FIREBASE_DB_URL}/productos.json`).
 */
export const FIREBASE_DB_URL = 'https://mesa-ludica-default-rtdb.firebaseio.com';
