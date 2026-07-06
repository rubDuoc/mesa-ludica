import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { Producto } from '../models/producto';

/** Catálogo simulado que devuelve el JSON en las pruebas. */
const MOCK: Producto[] = [
  { id: 'p-001', nombre: 'Catan', categoria: 'estrategia', precio: 31990, precio_antiguo: 39990, stock: 12, imagen: 'img/CATAN.jpg', descripcion: 'a' },
  { id: 'p-002', nombre: 'UNO',   categoria: 'cartas',     precio: 5390,  precio_antiguo: null,  stock: 30, imagen: 'img/UNO.jpg',   descripcion: 'b' },
  { id: 'p-003', nombre: 'Dixit', categoria: 'familiares', precio: 22490, precio_antiguo: 29990, stock: 10, imagen: 'img/DIXIT.jpg', descripcion: 'c' }
];

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
    // Sembramos el catálogo consumiendo el JSON simulado.
    const carga = service.cargarCatalogo();
    httpMock.expectOne('/data/productos.json').flush(MOCK);
    await carga;
  });

  afterEach(() => httpMock.verify());

  it('consume el catálogo desde el JSON y lo carga en el signal', () => {
    expect(service.totalProductos()).toBe(3);
  });

  it('getProductos() emite los productos del JSON (Observable)', () => {
    let recibidos: Producto[] = [];
    service.getProductos().subscribe(p => (recibidos = p));
    httpMock.expectOne('/data/productos.json').flush(MOCK);
    expect(recibidos.length).toBe(3);
  });

  it('agregar un producto aumenta el total', () => {
    service.agregarProducto({
      nombre: 'Nuevo juego',
      categoria: 'cartas',
      precio: 5000,
      precio_antiguo: null,
      stock: 3,
      imagen: 'img/nuevo.jpg',
      descripcion: 'Producto agregado en la prueba'
    });
    expect(service.totalProductos()).toBe(4);
  });

  it('eliminar un producto lo quita del catálogo', () => {
    service.eliminarProducto('p-001');
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
