import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { Producto, Categoria } from '../models/producto';
import { FIREBASE_DB_URL } from './firebase.config';

/** Base de la Realtime Database usada para verificar las URLs de las peticiones. */
const BASE = FIREBASE_DB_URL;

/** Catálogo simulado tal como lo devuelve Firebase: objeto indexado por id. */
const MOCK: Record<string, Producto> = {
  'p-001': { id: 'p-001', nombre: 'Catan', categoria: 'estrategia', precio: 31990, precio_antiguo: 39990, stock: 12, imagen: 'img/CATAN.jpg', descripcion: 'a' },
  'p-002': { id: 'p-002', nombre: 'UNO',   categoria: 'cartas',     precio: 5390,  precio_antiguo: null,  stock: 30, imagen: 'img/UNO.jpg',   descripcion: 'b' },
  'p-003': { id: 'p-003', nombre: 'Dixit', categoria: 'familiares', precio: 22490, precio_antiguo: 29990, stock: 10, imagen: 'img/DIXIT.jpg', descripcion: 'c' }
};

/** Categorías simuladas (Firebase las devuelve como arreglo). */
const CATEGORIAS_MOCK: Categoria[] = [
  { slug: 'estrategia', nombre: 'Estrategia', descripcion: 'x', imagen: 'img/cat-estrategia.svg' },
  { slug: 'cartas',     nombre: 'Cartas',     descripcion: 'y', imagen: 'img/cat-cartas.svg' }
];

/** Banners simulados (Firebase los devuelve como objeto indexado por slug). */
const BANNERS_MOCK = {
  estrategia: { titulo: 'Estrategia', bajada: 'Domina el tablero.' }
};

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
    // Sembramos el catálogo consumiendo Firebase (GET) con datos simulados.
    // cargarCatalogo pide productos, categorías y banners en paralelo.
    const carga = service.cargarCatalogo();
    httpMock.expectOne(`${BASE}/productos.json`).flush(MOCK);
    httpMock.expectOne(`${BASE}/categorias.json`).flush(CATEGORIAS_MOCK);
    httpMock.expectOne(`${BASE}/banners.json`).flush(BANNERS_MOCK);
    await carga;
  });

  afterEach(() => httpMock.verify());

  it('consume el catálogo desde Firebase y lo carga en el signal', () => {
    expect(service.totalProductos()).toBe(3);
  });

  it('consume las categorías y los banners desde Firebase', () => {
    expect(service.getCategorias().length).toBe(2);
    expect(service.getBanner('estrategia').bajada).toBe('Domina el tablero.');
  });

  it('getProductos() emite los productos (Observable, GET a Firebase)', () => {
    let recibidos: Producto[] = [];
    service.getProductos().subscribe(p => (recibidos = p));
    httpMock.expectOne(`${BASE}/productos.json`).flush(MOCK);
    expect(recibidos.length).toBe(3);
  });

  it('agregar un producto hace PUT y aumenta el total', () => {
    service.agregarProducto({
      nombre: 'Nuevo juego',
      categoria: 'cartas',
      precio: 5000,
      precio_antiguo: null,
      stock: 3,
      imagen: 'img/nuevo.jpg',
      descripcion: 'Producto agregado en la prueba'
    }).subscribe();
    const req = httpMock.expectOne(`${BASE}/productos/p-004.json`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
    expect(service.totalProductos()).toBe(4);
  });

  it('actualizar un producto hace PUT con los nuevos datos', () => {
    const actualizado: Producto = { ...MOCK['p-002'], precio: 4990 };
    service.actualizarProducto(actualizado).subscribe();
    const req = httpMock.expectOne(`${BASE}/productos/p-002.json`);
    expect(req.request.method).toBe('PUT');
    req.flush(actualizado);
    expect(service.getProductoPorId('p-002')?.precio).toBe(4990);
  });

  it('eliminar un producto hace DELETE y lo quita del catálogo', () => {
    service.eliminarProducto('p-001').subscribe();
    const req = httpMock.expectOne(`${BASE}/productos/p-001.json`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(service.getProductoPorId('p-001')).toBeUndefined();
  });

  it('calcula el descuento de un producto en oferta', () => {
    const enOferta: Producto = {
      id: 'x', nombre: 'x', categoria: 'cartas', precio: 8000,
      precio_antiguo: 10000, stock: 1, imagen: '', descripcion: ''
    };
    expect(service.descuento(enOferta)).toBe(20);
  });

  it('formatea el precio al estilo chileno', () => {
    expect(service.formatearPrecio(31990)).toContain('31.990');
  });
});
