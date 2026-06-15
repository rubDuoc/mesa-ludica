/* ============================================================
   Mesa Lúdica - Datos estáticos del catálogo
   DSY2202 - Experiencia 2, Semana 4

   En la Experiencia 1 estos datos vivían en localStorage (datos.js).
   Para esta entrega se cargan como VARIABLES estáticas en TypeScript,
   tal como pide la actividad. En la Experiencia 3 se reemplazarán
   por una API REST.
   ============================================================ */

import { Producto, Categoria } from '../models/producto';

/* Las 4 categorías que se muestran en la página de inicio */
export const CATEGORIAS: Categoria[] = [
  { slug: 'estrategia', nombre: 'Estrategia', descripcion: 'Juegos que ponen a prueba tu mente y tus tácticas.', imagen: 'img/cat-estrategia.svg' },
  { slug: 'familiares', nombre: 'Familiares', descripcion: 'Diversión para compartir con toda la familia.',     imagen: 'img/cat-familiares.svg' },
  { slug: 'fiesta',     nombre: 'Fiesta',     descripcion: 'Risas garantizadas para grupos grandes.',          imagen: 'img/cat-fiesta.svg' },
  { slug: 'cartas',     nombre: 'Cartas',     descripcion: 'Juegos rápidos y portátiles para cualquier lugar.', imagen: 'img/cat-cartas.svg' }
];

/* Texto del banner que encabeza cada página de categoría */
export const BANNERS: Record<string, { titulo: string; bajada: string }> = {
  estrategia: { titulo: 'Estrategia', bajada: 'Domina el tablero con ingenio y planificación.' },
  familiares: { titulo: 'Familiares', bajada: 'Diversión para compartir con toda la familia.' },
  fiesta:     { titulo: 'Fiesta',     bajada: 'Risas garantizadas para animar cualquier reunión.' },
  cartas:     { titulo: 'Cartas',     bajada: 'Mazos clásicos y modernos para jugar donde quieras.' }
};

/* Los 12 juegos del catálogo */
export const PRODUCTOS: Producto[] = [
  // Estrategia
  { id: 'p-001', nombre: 'Catan',                     categoria: 'estrategia', precio: 31990, precio_antiguo: 39990, stock: 12, imagen: 'img/CATAN.jpg',           descripcion: 'Construye, comercia y coloniza la isla de Catan en este clásico de la estrategia.' },
  { id: 'p-002', nombre: 'Carcassonne',               categoria: 'estrategia', precio: 27990, precio_antiguo: null,  stock: 9,  imagen: 'img/carcassonne.png',     descripcion: 'Coloca losetas y construye ciudades medievales en este juego de colocación.' },
  { id: 'p-003', nombre: 'Ajedrez Deluxe',            categoria: 'estrategia', precio: 21240, precio_antiguo: 24990, stock: 15, imagen: 'img/AJEDREZ_DELUXE.webp', descripcion: 'Tablero de madera y piezas talladas a mano para los amantes del clásico rey de los juegos.' },
  // Familiares
  { id: 'p-004', nombre: 'Monopoly Clásico',          categoria: 'familiares', precio: 22990, precio_antiguo: null,  stock: 18, imagen: 'img/MONOPOLY.webp',       descripcion: 'Compra propiedades, cobra arriendos y lleva a la quiebra a tus rivales.' },
  { id: 'p-005', nombre: 'Dixit',                     categoria: 'familiares', precio: 22490, precio_antiguo: 29990, stock: 10, imagen: 'img/DIXIT.jpg',           descripcion: 'Un juego de imaginación y cartas ilustradas donde la creatividad gana la partida.' },
  { id: 'p-006', nombre: 'Jenga Torre',               categoria: 'familiares', precio: 12990, precio_antiguo: null,  stock: 25, imagen: 'img/JENGA.webp',          descripcion: 'Retira bloques y apílalos sin que la torre caiga. Pulso y nervios garantizados.' },
  // Fiesta
  { id: 'p-007', nombre: "Time's Up!",                categoria: 'fiesta',     precio: 13990, precio_antiguo: 19990, stock: 14, imagen: 'img/TIMES_UPS.jpg',       descripcion: 'Adivina personajes contra el reloj en tres rondas cada vez más locas.' },
  { id: 'p-008', nombre: 'Pictionary',                categoria: 'fiesta',     precio: 17990, precio_antiguo: null,  stock: 12, imagen: 'img/PICTIONARY.webp',     descripcion: 'Dibuja contra el tiempo y haz que tu equipo adivine la palabra secreta.' },
  { id: 'p-009', nombre: '¿Quién es quién?',          categoria: 'fiesta',     precio: 13490, precio_antiguo: 14990, stock: 16, imagen: 'img/QUIEN_ES_QUIEN.jpg',  descripcion: 'Haz preguntas y descarta personajes hasta adivinar el del rival.' },
  // Cartas
  { id: 'p-010', nombre: 'UNO',                       categoria: 'cartas',     precio: 5390,  precio_antiguo: 8990,  stock: 30, imagen: 'img/UNO.jpg',             descripcion: 'El clásico juego de cartas de colores y números. ¡No olvides gritar UNO!' },
  { id: 'p-011', nombre: 'Carioca',                   categoria: 'cartas',     precio: 6990,  precio_antiguo: null,  stock: 22, imagen: 'img/CARIOCA.webp',        descripcion: 'El popular juego chileno de naipes con escalas y tríos ronda tras ronda.' },
  { id: 'p-012', nombre: 'Cartas Españolas (Brisca)', categoria: 'cartas',     precio: 4490,  precio_antiguo: 5990,  stock: 17, imagen: 'img/BRISCA.jpg',          descripcion: 'Mazo de cartas españolas ideal para Brisca y otros juegos tradicionales.' }
];
